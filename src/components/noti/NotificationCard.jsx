import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const NotificationCard = ({ noti }) => {
  const navigate = useNavigate();
  const goLink = (link) => {
    navigate(link);
  };
  const guideMessage = {
    CHAT_MESSAGE: "채팅 메시지가 도착했습니다.",
    KEYWORD_MATCH: "등록한 키워드의 상품이 등록되었습니다.",
  };

  return (
    <div
      className={clsx(
        `border border-brand-mediumgray rounded-2xl p-5`,
        noti.isRead && `bg-neutral-100 text-neutral-400`
      )}
      onClick={() => goLink(noti.linkUrl)}
    >
      <p className="font-bold">{guideMessage[noti.notificationType]}</p>
      <div className="flex flex-row gap-10 items-center">
        <div>{noti.body}</div>
        <div className="grow"></div>
        {noti.isRead ? (
          <div className="text-green-700">읽음</div>
        ) : (
          <div className="text-red-700">안읽음</div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
