import Container from "@/components/Container";
import { chatMessagesApi, markChatRoomAsReadApi } from "@/common/api/chat.api";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";
import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatProductInfoBar from "@/components/chat/ChatProductInfoBar";
import ChatMessage from "@/components/chat/ChatMessage";
import { useAuth } from "@/hooks/AuthContext";
import dayjs from "dayjs";
import { createChatClient } from "@/lib/chatStompClient";

const ChatRoomPage = () => {
  const { chatRoomId } = useParams();
  const [chatInfo, setChatInfo] = useState(null);
  const [myInfo, setMyInfo] = useState({});
  const [yourInfo, setYourInfo] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  // 상대가 어디까지 읽었는지(메시지 옆 "읽음" 표시용)
  const [yourLastReadMessageId, setYourLastReadMessageId] = useState(0);
  const { user, loading } = useAuth();

  const { setHeader } = useHeader();
  const productProps = {
    ...(chatInfo ?? {}),
    thumbnailUrl: chatInfo?.productImage,
  };

  const settingChatParticipantInfo = (data) => {
    const amISeller = user.memberId === data.sellerId;
    const amIBuyer = user.memberId === data.buyerId;
    if (amISeller) {
      setMyInfo({
        memberId: data.sellerId,
        profileImage: data.sellerProfileImage,
        nickName: data.sellerNickname,
      });
      setYourInfo({
        memberId: data.buyerId,
        profileImage: data.buyerProfileImage,
        nickName: data.buyerNickname,
      });
      return;
    }

    if (amIBuyer) {
      setMyInfo({
        memberId: data.buyerId,
        profileImage: data.buyerProfileImage,
        nickName: data.buyerNickname,
      });
      setYourInfo({
        memberId: data.sellerId,
        profileImage: data.sellerProfileImage,
        nickName: data.sellerNickname,
      });
      return;
    }
  };

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, msg) => {
      const dateKey = dayjs(msg.createdAt).format("YYYY년 M월 D일");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(msg);

      return acc;
    }, {});
  };

  const fetchChatMessages = useCallback(async () => {
    const data = await chatMessagesApi(chatRoomId);
    setChatInfo(data);
    setHeader({
      title: data.sellerNickname,
      // 옵션
      titleAlign: "left",
      isSticky: true,
      // showBack: true,
      // hideRight: false,
      // rightActions: [...]
    });
    setChatMessages(data.chatMessages);
    settingChatParticipantInfo(data);
    if (data.yourLastReadMessageId) {
      setYourLastReadMessageId(Number(data.yourLastReadMessageId || 0));
    } else {
      setYourLastReadMessageId(0);
    }
  }, [chatRoomId, setHeader, user?.memberId]);

  const clientRef = useRef(null);
  const subRef = useRef(null);
  const readSubRef = useRef(null);
  // read 중복 호출 방지/최대값 유지용
  const lastReadSentRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const [text, setText] = useState("");

  // 마지막 메시지 id
  const lastMessageId = useMemo(() => {
    if (!chatMessages.length) return 0;
    const last = chatMessages[chatMessages.length - 1];
    return Number(last.messageId || 0);
  }, [chatMessages]);

  // read 호출 함수 (중복/감소 방지)
  const markAsRead = useCallback(
    async (messageId) => {
      const id = Number(messageId || 0);
      if (!chatRoomId || !user) return;
      if (!id || id <= 0) return;

      // 이미 보낸 read보다 작거나 같으면 무시
      if (id <= lastReadSentRef.current) return;

      lastReadSentRef.current = id;
      try {
        await markChatRoomAsReadApi(chatRoomId, id);
      } catch (e) {
        // 실패하면 다음 호출에서 다시 시도할 수 있게 롤백
        lastReadSentRef.current = lastReadSentRef.current - 1;
        console.warn("markAsRead failed", e);
      }
    },
    [chatRoomId, user]
  );

  // 1) STOMP 연결 + 구독
  useEffect(() => {
    if (!chatRoomId || !user) return;

    const client = createChatClient({
      debug: true,
      onConnect: () => {
        setConnected(true);

        // 기존 구독 정리
        try {
          subRef.current?.unsubscribe();
        } catch {}
        try {
          readSubRef.current?.unsubscribe();
        } catch {}

        // 메시지 구독
        subRef.current = client.subscribe(
          `/sub/chat/room/${chatRoomId}`,
          (frame) => {
            const payload = JSON.parse(frame.body);

            const normalized = {
              ...payload,
              isMine: payload.memberId === user.memberId,
            };

            setChatMessages((prev) => [...prev, normalized]);
          }
        );

        // 읽음 이벤트 구독 (서버에서 /sub/chat/rooms/{id}/read 로 브로드캐스트하던거)
        readSubRef.current = client.subscribe(
          `/sub/chat/room/${chatRoomId}/read`,
          (frame) => {
            const evt = JSON.parse(frame.body);
            // evt: { chatRoomId, readerId, lastReadMessageId }
            // 내가 보낸 read 이벤트는 굳이 반영 안 해도 됨
            if (evt.readerId === user.memberId) return;

            setYourLastReadMessageId((prev) =>
              Math.max(prev, Number(evt.lastReadMessageId || 0))
            );
          }
        );
      },
      onDisconnect: () => setConnected(false),
      onError: (frame) => console.error("STOMP ERROR:", frame.body),
    });

    clientRef.current = client;
    client.activate();

    return () => {
      try {
        subRef.current?.unsubscribe();
      } catch {}
      try {
        readSubRef.current?.unsubscribe();
      } catch {}
      try {
        client.deactivate();
      } catch {}
    };
  }, [chatRoomId, user, markAsRead]);

  // 2) send 함수
  const sendMessage = () => {
    const client = clientRef.current;
    if (!client || !connected) return;
    if (!text.trim()) return;

    // 서버가 받는 DTO에 맞춰 보내기
    const body = {
      chatRoomId,
      content: text.trim(),
    };

    client.publish({
      destination: "/pub/chat.send",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setText("");
  };

  useEffect(() => {
    if (!chatRoomId || !user) return;

    fetchChatMessages();
  }, [chatRoomId, user, fetchChatMessages]);
  useEffect(() => {
    if (!chatRoomId || !user) return;
    if (!lastMessageId || lastMessageId <= 0) return;

    const tryMarkRead = () => {
      if (document.visibilityState !== "visible") return;
      markAsRead(lastMessageId);
    };

    // 1) 지금 보이면 바로 실행
    tryMarkRead();

    // 2) 나중에 visible 되는 순간에도 실행
    const onVisibilityChange = () => tryMarkRead();
    window.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [chatRoomId, user, lastMessageId, markAsRead]);

  const grouped = groupMessagesByDate(chatMessages);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // 사용자가 바닥 근처에 있을 때만 자동 스크롤 유지
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 120; // 바닥에서 120px 이내면 “바닥 근처”
      const isNearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setAutoScroll(isNearBottom);
    };

    el.addEventListener("scroll", onScroll);
    onScroll(); // 초기 1회

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // 메시지가 바뀌면 (처음 진입/새 메시지) 아래로
  useEffect(() => {
    if (!bottomRef.current) return;
    if (!autoScroll) return; // 사용자가 위 보고 있으면 강제 이동 금지

    bottomRef.current.scrollIntoView({ behavior: "auto" }); // 처음엔 auto 추천
  }, [chatMessages, autoScroll]);

  return (
    <Container className="flex flex-col flex-1 min-h-screen">
      <div className="sticky top-[64px] bg-white z-50 ">
        <ChatProductInfoBar
          {...productProps}
          onStatusChanged={fetchChatMessages}
        />
      </div>
      <div className="p-4 flex flex-col space-y-4">
        {/* <div className="text-sm text-gray-500 text-center">날짜</div>
        {chatMessages.length > 0 &&
          chatMessages.map((msg, i) => (
            <ChatMessage
              key={i}
              userInfo={msg.isMine ? myInfo : yourInfo}
              message={msg}
            />
          ))} */}
        {Object.entries(grouped).map(([dateLabel, messages]) => (
          <div key={dateLabel} className="flex flex-col space-y-4">
            {/* 날짜 가운데 정렬 */}
            <div className="text-xs text-gray-500 text-center my-2">
              {dateLabel}
            </div>
            {messages.map((msg, i) => (
              <ChatMessage
                key={msg.messageId ?? i}
                userInfo={msg.isMine ? myInfo : yourInfo}
                message={msg}
                yourLastReadMessageId={yourLastReadMessageId}
              />
            ))}
          </div>
        ))}
      </div>
      <div ref={bottomRef} />
      {/* 하단 메시지 입력바 */}
      <div className="mt-auto sticky bottom-0 bg-white border-t z-50 ">
        <ChatInputBar
          text={text}
          setText={setText}
          sendMessage={sendMessage}
          connected={connected}
        />
      </div>
    </Container>
  );
};

export default ChatRoomPage;
