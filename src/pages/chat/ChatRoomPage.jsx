import Container from "@/components/Container";
import { chatMessagesApi } from "@/common/api/chat.api";
import { useState, useEffect, useRef, useCallback } from "react";
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
      // showBack: true,
      // hideRight: false,
      // rightActions: [...]
    });
    setChatMessages(data.chatMessages);
    settingChatParticipantInfo(data);
  }, [chatRoomId, setHeader, user?.memberId]);

  const clientRef = useRef(null);
  const subRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // 1) 연결 + 구독
  useEffect(() => {
    if (!chatRoomId || !user) return;

    const client = createChatClient({
      debug: true,
      onConnect: () => {
        setConnected(true);

        // 기존 구독이 있으면 정리 후 재구독
        if (subRef.current) subRef.current.unsubscribe();

        subRef.current = client.subscribe(
          `/sub/chat/room/${chatRoomId}`,
          (frame) => {
            const payload = JSON.parse(frame.body);
            console.log("payload", payload);

            const normalized = {
              ...payload,
              isMine: payload.memberId === user.memberId,
            };

            setChatMessages((prev) => [...prev, normalized]);
          }
        );
      },
      onDisconnect: () => setConnected(false),
      onError: (frame) => console.error("STOMP ERROR:", frame.body),
    });

    clientRef.current = client;
    client.activate();

    return () => {
      // cleanup
      try {
        subRef.current?.unsubscribe();
      } catch {}
      client.deactivate();
    };
  }, [chatRoomId, user]);

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
    console.log("chatRoomId", chatRoomId);

    if (user) {
      fetchChatMessages();
    }
  }, [chatRoomId, user]);

  const grouped = groupMessagesByDate(chatMessages);

  return (
    <Container className="flex flex-col flex-1 min-h-screen">
      <div className="sticky top-0 bg-white z-50 ">
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
                key={msg.chatMessageId ?? i}
                userInfo={msg.isMine ? myInfo : yourInfo}
                message={msg}
              />
            ))}
          </div>
        ))}
      </div>
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
