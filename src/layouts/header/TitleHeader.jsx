// src/layouts/header/TitleHeader.jsx
import React from "react";
import { ChevronLeft, Bell, Home } from "lucide-react";
import BellWithBadge from "@/components/BellWithBadge";
import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/NotificationContext";

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
  isSticky = false,
  onBack,
  showBellWithRightSlot = false,
}) => {
  const { unreadCount } = useNotification();

  const navigate = useNavigate();
  // 멀티 액션이 존재하는지
  const hasRightActions =
    !hideRight && Array.isArray(rightActions) && rightActions.length > 0;

  // 우측 슬롯을 눌렀을 때, 위치 포함한 이벤트
  // TitleHeader.jsx
  const openMenuWithAnchor = (e) => {
    const anchorEl = e.currentTarget;

    window.dispatchEvent(
      new CustomEvent("seller-menu-open", {
        detail: { anchorEl }, // anchorEl은 실제 DOM 노드. 언제든 현재 위치를 다시 계산 가능
      })
    );
  };

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
          className="text-brand-green font-semibold cursor-pointer"
          onClick={() => rightButtonEvent?.()}
        >
          {rightButtonText}
        </button>
      );
    }

    // 기본 우측 아이콘 또는 슬롯
    return (
      <div className="inline-flex items-center">
        <button type="button" onClick={openMenuWithAnchor}>
          {rightSlot ? (
            <div className="flex items-center gap-2">
              {showBellWithRightSlot && (
                <span className="cursor-pointer">
                  <BellWithBadge unreadCount={unreadCount} />
                </span>
              )}
              {rightSlot}
            </div>
          ) : (
            <span className="cursor-pointer">
              <BellWithBadge
                unreadCount={unreadCount}
                className="cursor-pointer"
              />
            </span>
          )}
        </button>
      </div>
    );
  };

  // 공통 뒤로가기 처리
  const handleBackClick = () => {
    if (typeof onBack === "function") {
      onBack();
    } else {
      // 기본 동작
      window.history.back();
    }
  };

  return (
    <Container
      className={isSticky ? `sticky top-0 z-40 bg-white` : `relative z-20`}
    >
      <header className="grid grid-cols-[1fr_auto_1fr] items-center mb-6">
        {/* 왼쪽: 뒤로가기 */}
        <div className="flex items-center justify-start min-w-[80px]">
          {!hideLeft && (
            <>
              {showBack && (
                <button
                  className="p-1 -ml-1 cursor-pointer"
                  onClick={handleBackClick}
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {showHome && (
                <button
                  className="ml-2 p-1 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  <Home size={22} />
                </button>
              )}
            </>
          )}
        </div>

        {/* 중앙: 타이틀 */}
        <div
          className={`flex items-center ${
            titleAlign === "left" ? "justify-start" : "justify-center"
          }`}
        >
          <h1 className="text-xl font-bold truncate max-w-[200px]">
            {title || ""}
          </h1>
        </div>

        {/* 오른쪽 영역 */}
        <div className="min-w-[80px] flex items-center justify-end">
          {renderRight()}
        </div>
      </header>
    </Container>
  );
};

export default TitleHeader;
