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
import MenuActionsContainer from "@/components/MenuActionsContainer";
import { useNotification } from "@/hooks/NotificationContext";
import { notificationApi } from "@/common/api/notification.api";
import FrequentPhraseModal from "@/components/common/FrequentPhraseModal";
import { getProductCustomTextsApi } from "@/common/api/customText.api";

const ChatRoomPage = () => {
  const { chatRoomId } = useParams();
  const [chatInfo, setChatInfo] = useState(null);
  const [myInfo, setMyInfo] = useState({});
  const [yourInfo, setYourInfo] = useState({});
  const [chatMessages, setChatMessages] = useState([]);

  const [text, setText] = useState(""); //채팅 입력창
  const [phraseModalOpen, setPhraseModalOpen] = useState(false); // 자주 쓰는 문구 모달

  // 자주 쓰는 문구 목록
  const [phrases, setPhrases] = useState([]);

  //자주 쓰는 문구 핸들러
  // CHAT 기준 문구 재조회 함수
  const fetchChatPhrases = useCallback(async () => {
    const data = await getProductCustomTextsApi({
      contentType: "CHAT",
    });
    setPhrases(data);
  }, []);

  //  모달 열릴 때 문구 조회
  useEffect(() => {
    if (!phraseModalOpen) return;
    fetchChatPhrases();
  }, [phraseModalOpen, fetchChatPhrases]);

  // 문구 선택 → 입력창 반영
  const handleApplyPhrase = useCallback((phraseText) => {
    setText((prev) => (prev ? prev + "\n" + phraseText : phraseText));
    setPhraseModalOpen(false);
  }, []);

  // 상대가 어디까지 읽었는지(메시지 옆 "읽음" 표시용)
  const [yourLastReadMessageId, setYourLastReadMessageId] = useState(0);
  const { user, loading } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false); // 점 3개 메뉴 오픈
  const [anchorEl, setAnchorEl] = useState(null);

  const { setHeader } = useHeader();
  const { refreshUnreadCount } = useNotification();

  const productProps = {
    ...(chatInfo ?? {}),
    thumbnailUrl: chatInfo?.productImage,
  };

  // 헤더의 rightSlot(점 3개 버튼)이 클릭되면 발생하는 이벤트 수신
  useEffect(() => {
    const handler = (e) => {
      setAnchorEl(e?.detail?.anchorEl ?? null); // 커스텀 이벤트로 보낼 때 detail 안에 데이터를 넣어 전달. 어디 기준으로 띄울지(앵커 요소)를 상태로 저장
      setMenuOpen(true);
    };

    window.addEventListener("seller-menu-open", handler); // 해당 이벤트를 구독
    return () => window.removeEventListener("seller-menu-open", handler); // 컴포넌트가 사라질 때 구독 해제
    // 페이지 이동 등으로 컴포넌트가 언마운트될 때 이벤트가 남아서 꼬이는 문제를 막음
  }, []);

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
    setChatMessages(data.chatMessages);
    settingChatParticipantInfo(data);
    if (data.yourLastReadMessageId) {
      setYourLastReadMessageId(Number(data.yourLastReadMessageId || 0));
    } else {
      setYourLastReadMessageId(0);
    }
  }, [chatRoomId, user?.memberId]);

  const clientRef = useRef(null);
  const subRef = useRef(null);
  const readSubRef = useRef(null);
  // read 중복 호출 방지/최대값 유지용
  const lastReadSentRef = useRef(0);

  const [connected, setConnected] = useState(false);
  //const [text, setText] = useState("");

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

  // 1) STOMP 연결 + 구독 (싱글턴)
  useEffect(() => {
    if (!chatRoomId || !user) return;
    const stomp = createChatClient({ debug: true }); // 싱글턴 API
    setConnected(true); // (선택) connected 상태는 아래 onStatusChange로 더 정확히 할 수도 있음

    // 기존 구독 정리
    try {
      subRef.current?.();
    } catch {}
    try {
      readSubRef.current?.();
    } catch {}

    // 메시지 구독
    subRef.current = stomp.subscribe(
      `/sub/chat/room/${chatRoomId}`,
      (payload) => {
        // payload는 이미 JSON parse 된 객체(또는 raw 문자열)
        if (!payload) return;

        const normalized = {
          ...payload,
          isMine: payload.memberId === user.memberId,
        };

        setChatMessages((prev) => [...prev, normalized]);
      }
    );

    // 읽음 이벤트 구독
    readSubRef.current = stomp.subscribe(
      `/sub/chat/room/${chatRoomId}/read`,
      (evt) => {
        if (!evt) return;
        if (evt.readerId === user.memberId) return;

        setYourLastReadMessageId((prev) =>
          Math.max(prev, Number(evt.lastReadMessageId || 0))
        );
      }
    );

    // 연결 상태를 정확히 반영하고 싶으면
    const off = stomp.onStatusChange((status) => {
      if (status === "connected") setConnected(true);
      if (status === "disconnected" || status === "deactivated")
        setConnected(false);
      if (status === "stomp-error") console.error("STOMP ERROR");
    });

    // activate는 subscribe 내부에서도 호출되지만, 명시해도 OK
    stomp.activate();

    return () => {
      // 채팅방 나갈 때는 "구독만" 해제 (연결은 유지)
      try {
        subRef.current?.();
      } catch {}
      try {
        readSubRef.current?.();
      } catch {}
      subRef.current = null;
      readSubRef.current = null;

      try {
        off?.();
      } catch {}
      // stomp.deactivate()는 하지 않음 (앱 전체에서 1개 공유해야 하니까)
    };
  }, [chatRoomId, user?.memberId]);

  // 2) send 함수
  const sendMessage = () => {
    if (!text.trim()) return;

    const stomp = createChatClient(); // 싱글턴 API

    const payload = {
      chatRoomId,
      content: text.trim(),
    };

    // destination만 넘기면 내부에서 JSON.stringify 처리함
    const ok = stomp.publish("/pub/chat.send", payload);

    if (!ok) {
      // 연결이 아직 안 됐거나 끊긴 상태
      console.warn("STOMP not connected yet. message not sent.");
      return;
    }

    setText("");
  };

  useEffect(() => {
    if (!chatRoomId || !user) return;

    fetchChatMessages();
  }, [chatRoomId, user, fetchChatMessages]);
  useEffect(() => {
    if (!chatRoomId || !user) return;
    if (!lastMessageId || lastMessageId <= 0) return;

    const tryRead = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) {
        markAsRead(lastMessageId);
      }
    };

    document.addEventListener("visibilitychange", tryRead);
    window.addEventListener("focus", tryRead);

    // 최초 진입 시도
    tryRead();

    return () => {
      document.removeEventListener("visibilitychange", tryRead);
      window.removeEventListener("focus", tryRead);
    };
  }, [chatRoomId, user, lastMessageId, markAsRead]);

  useEffect(() => {
    if (yourInfo && yourInfo.nickName) {
      setHeader({
        title: yourInfo.nickName,
        titleAlign: "left",
        isSticky: true,
      });
    }
  }, [yourInfo, setHeader]);

  const grouped = groupMessagesByDate(chatMessages);

  const notiReadOnceRef = useRef(new Set());
  useEffect(() => {
    if (!chatRoomId || !user) return;

    // 이미 이 채팅방에서 처리했으면 skip
    if (notiReadOnceRef.current.has(chatRoomId)) return;
    notiReadOnceRef.current.add(chatRoomId);

    (async () => {
      try {
        const updated = await notificationApi.markNotificationChatRoomAsRead(
          chatRoomId
        );
        if (updated > 0) await refreshUnreadCount();
      } catch (e) {
        console.error("markNotificationChatRoomAsRead failed", e);
        // 실패했으면 다시 시도 가능하도록 롤백
        notiReadOnceRef.current.delete(chatRoomId);
      }
    })();
  }, [chatRoomId, user?.memberId, refreshUnreadCount]);

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
      <div className="sticky top-[64px] bg-white z-50">
        <ChatProductInfoBar
          {...productProps}
          onStatusChanged={fetchChatMessages} // 상품 상태 변경시 채팅정보 재조회
        />
      </div>
      {chatMessages.length <= 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-brand-mediumgray">대화 중인 채팅이 없습니다.</p>
        </div>
      )}
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
          onOpenPhraseModal={() => setPhraseModalOpen(true)}
        />
      </div>

      {/* 자주 쓰는 문구 모달 */}
      <FrequentPhraseModal
        open={phraseModalOpen}
        onClose={() => setPhraseModalOpen(false)}
        phrases={phrases}
        onApplyPhrase={handleApplyPhrase} // 문구 적용 함수
        onReloadPhrases={fetchChatPhrases} // 문구 재조회 함수
      />

      {/* 점 세 개 메뉴*/}
      <MenuActionsContainer
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        targetMemberId={yourInfo?.memberId}
        reportTargetType="MEMBER"
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </Container>
  );
};

export default ChatRoomPage;
