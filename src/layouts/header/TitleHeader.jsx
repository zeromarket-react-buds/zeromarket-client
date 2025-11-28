import { ChevronLeft, Bell } from "lucide-react";
import Container from "@/components/Container";

const TitleHeader = ({
  title,
  rightSlot,
  hideRight = false,
  showBack = true,
  rightButtonText,
  rightButtonEvent,
}) => {
  return (
    <Container>
      <header className="flex items-center justify-between mb-6">
        {/* 왼쪽: 뒤로가기 */}
        {showBack ? (
          <button onClick={() => window.history.back()}>
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-6" /> // 자리는 맞추되 내용 없음
        )}

        {/* 중앙: 타이틀 */}
        <h1 className="text-xl font-bold">{title}</h1>
        {/* 오른쪽 아이콘: 기본 Bell, 커스텀(rightSlot) 있으면 대체 {rightSlot ? rightSlot :}추가 */}
        {/* 오른쪽 아예 없는 경우 추가  */}

        {/* 마이프로필 오른쪽: Bell → 완료 버튼으로 대체 */}
        {hideRight ? (
          <div className="w-6" />
        ) : rightButtonText ? (
          <button
            className="text-brand-green font-semibold"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("title-right-click", {
                  detail: rightButtonEvent,
                })
              )
            }
          >
            {rightButtonText}
          </button>
        ) : (
          <button>{rightSlot ? rightSlot : <Bell size={24} />}</button>
        )}
      </header>
    </Container>
  );
};

export default TitleHeader;
