import dayjs from "@/utils/time";

const ChatRecentMessage = ({
  productImage,
  yourNickname,
  createdAt,
  content,
}) => {
  return (
    <div className="grid grid-cols-3 gap-5 items-center">
      <div className="overflow-hidden col-span-1">
        <img
          src={productImage}
          className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1 col-span-2">
        <div className="font-semibold line-clamp-1 flex flex-row gap-2">
          <span>{yourNickname}</span> <span>&#183;</span>
          <span>{dayjs(createdAt).fromNow()}</span>
        </div>
        <div className="line-clamp-1">{content}</div>
      </div>
    </div>
  );
};

export default ChatRecentMessage;
