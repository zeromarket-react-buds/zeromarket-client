import { UserRound } from "lucide-react";
import dayjs from "dayjs";

const ChatMessage = ({ userInfo, message }) => {
  // memberId
  // profileImage
  // nickName
  const {
    messageId,
    chatRoomId,
    memberId,
    content,
    messageType,
    createdAt,
    updatedAt,
    read,
    mine,
    isRead,
    isMine,
  } = message;

  return (
    <>
      {" "}
      {message.isMine ? (
        <div className="flex space-x-4">
          <div className="grow"></div>
          <div className="text-sm text-gray-500 justify-end self-end mr-2">
            {dayjs(message.createdAt).format("A h:mm")}
          </div>
          <div className="rounded-2xl text-sm border-2 p-3 border-brand-green min-w-1/3 max-w-1/2 bg-brand-ivory">
            {message.content}
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-brand-ivory font-semibold">
            <UserRound className="size-15" />
          </div>
          <div className="rounded-2xl text-sm border-2 p-3 border-brand-green min-w-1/3 max-w-1/2">
            {message.content}
          </div>
          <div className="text-sm text-gray-500 self-end -ml-2">
            {dayjs(message.createdAt).format("A h:mm")}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatMessage;
