import Container from "@/components/Container";
import { chatMessagesApi } from "@/common/api/chat.api";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatRoomPage = () => {
  const { chatRoomId } = useParams();
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    console.log("chatRoomId", chatRoomId);
    const fetchChatMessages = async () => {
      const data = await chatMessagesApi(chatRoomId);
      setChatMessages(data);
    };
    fetchChatMessages();
  }, [chatRoomId]);

  return (
    <Container>
      채팅방
      {chatMessages.length > 0 &&
        chatMessages.map((msg) => <div>{JSON.stringify(msg)}</div>)}
    </Container>
  );
};

export default ChatRoomPage;
