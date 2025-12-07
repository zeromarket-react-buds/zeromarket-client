// src/layouts/header/TitleHeader.jsx
import React from "react";
import { ChevronLeft, Bell, Home } from "lucide-react";
import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";

const TitleHeader = ({
  title,
  titleAlign = "center", // ⭐ 새로 추가 (optional)
  rightSlot,
  hideLeft = false,
  hideRight = false,
  showBack = true,
  showHome = true,
  rightButtonText, // 기존 단일 버튼 유지
  rightButtonEvent, // 기존 단일 버튼 유지

  rightActions, // ⭐ HeaderContext에서 내려오는 멀티 버튼
}) => {
  const navigate = useNavigate();
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
          {rightActions.map((action, i) => {
            // 1) 이미 만들어진 React 컴포넌트인 경우
            if (React.isValidElement(action)) {
              return (
                <div key={action.key ?? i} className="inline-flex items-center">
                  {action}
                </div>
              );
            }

            // 2) 기존처럼 설정 객체인 경우
            const { key, label, icon, onClick, className } = action || {};
            return (
              <button
                key={key ?? i}
                onClick={onClick}
                className={
                  className ??
                  "text-brand-green font-semibold inline-flex items-center gap-1"
                }
              >
                {icon}
                {label}
              </button>
            );
            // <button
            //   key={action.key ?? i}
            //   onClick={action.onClick}
            //   className={
            //     action.className ??
            //     "text-brand-green font-semibold inline-flex items-center gap-1"
            //   }
            // >
            //   {action.icon}
            //   {action.label}
            // </button>
          })}
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
        {hideLeft ? (
          <div className="w-6" />
        ) : showBack ? (
          <div className="flex items-center gap-1 min-w-12">
            <button onClick={() => window.history.back()}>
              <ChevronLeft size={24} />
            </button>
            {showHome && (
              <button className="ml-3" onClick={() => navigate("/")}>
                <Home size={22} />
              </button>
            )}
          </div>
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
        <div className="min-w-[48px] flex justify-end">{renderRight()}</div>
      </header>
    </Container>
  );
};

export default TitleHeader;
