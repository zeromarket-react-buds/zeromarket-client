import { Bell } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const BellWithBadge = ({ unreadCount, size = "M" }) => {
  const isLarge = size === "L";
  const navigate = useNavigate();

  return (
    <div className="relative inline-block sle">
      {/* 1. 벨 아이콘 */}
      <Bell
        size={isLarge ? 28 : 24}
        onClick={() => navigate("/me/notifications")}
      />

      {/* 2. 읽지 않은 알림 배지 */}
      {unreadCount >= 0 && (
        <span
          className={clsx(
            `
            absolute
            flex items-center justify-center
            rounded-full
            bg-red-500 text-white
            font-bold leading-none
            border-2 border-white
          `,
            isLarge
              ? `
                -bottom-1 -right-1
                min-w-[22px] h-[22px]
                px-[4px]
                text-[15px]
              `
              : `
                -bottom-0.5 -right-0.5
                min-w-[18px] h-[18px]
                px-[3px]
                text-[14px]
              `
          )}
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
};
export default BellWithBadge;
