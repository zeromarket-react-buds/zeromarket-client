// src/layouts/header/TitleHeader.jsx
import { ChevronLeft, Bell } from "lucide-react";
import Container from "@/components/Container";

const TitleHeader = ({
  title,
  titleAlign = "center", // ⭐ 새로 추가 (optional)
  rightSlot,
  hideRight = false,
  showBack = true,
  rightButtonText, // 기존 단일 버튼 유지
  rightButtonEvent, // 기존 단일 버튼 유지

  rightActions, // ⭐ HeaderContext에서 내려오는 멀티 버튼
}) => {
  // 멀티 액션이 존재하는지
  const hasRightActions =
    !hideRight && Array.isArray(rightActions) && rightActions.length > 0;

  // 오른쪽 UI 렌더링
  const renderRight = () => {
    if (hideRight) return <div className="w-6" />;

    // ⭐ new: 여러 개 버튼 지원
    if (hasRightActions) {
      return (
        <div className="flex items-center gap-2">
          {rightActions.map((action, i) => (
            <button
              key={action.key ?? i}
              onClick={action.onClick}
              className={
                action.className ??
                "text-brand-green font-semibold inline-flex items-center gap-1"
              }
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      );
    }

    // 기존 우측 버튼
    if (rightButtonText) {
      return (
        <button
          className="text-brand-green font-semibold"
          onClick={() => rightButtonEvent?.()}
        >
          {rightButtonText}
        </button>
      );
    }

    // 기본 우측 아이콘 또는 슬롯
    return <button>{rightSlot ? rightSlot : <Bell size={24} />}</button>;
  };

  return (
    <Container className="relative z-20">
      <header
        className={`flex items-center justify-between mb-6 ${
          titleAlign === "left" ? "pr-2" : ""
        }`}
      >
        {/* 왼쪽: 뒤로가기 */}
        {showBack ? (
          <button onClick={() => window.history.back()}>
            <ChevronLeft size={24} />
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* 중앙: 타이틀 */}
        <h1
          className={`text-xl font-bold ${
            titleAlign === "left" ? "flex-1 text-left pl-2" : ""
          }`}
        >
          {title}
        </h1>

        {/* 오른쪽 영역 */}
        {renderRight()}
      </header>
    </Container>
  );
};

export default TitleHeader;
