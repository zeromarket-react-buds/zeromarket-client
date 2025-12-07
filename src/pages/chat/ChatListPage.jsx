import Container from "@/components/Container";
import { chatRoomsApi } from "@/common/api/chat.api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ChatRecentMessage from "@/components/chat/ChatRecentMessage";

const ChatListPage = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const data = await chatRoomsApi();
      setChats(data);
    };
    fetchChatRooms();
  }, []);

  return (
    <Container>
      <div className="p-8 flex flex-col space-y-4">
        {chats &&
          chats.map((chat) => (
            <div
              className="border border-brand-green rounded-2xl p-2"
              key={chat.chatRoomId}
            >
              <Link to={`/chats/${chat.chatRoomId}`}>
                <ChatRecentMessage {...chat}></ChatRecentMessage>
              </Link>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default ChatListPage;
