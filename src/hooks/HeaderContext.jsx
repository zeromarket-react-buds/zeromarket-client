// src/hooks/HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext(null);

// 헤더 전체 상태 기본값
// const defaultHeaderState = {
//   // title: null, // 라우터에서 내려준 정적 타이틀 안들어가는 문제 해결
//   titleAlign: "center", // "left" | "center"
//   showBack: true,
//   hideRight: false,
//   rightActions: [], // { key, label, icon, onClick, className }[]
//   rightSlot: null,
// };

export const defaultHeaderState = {
  title: "",
  titleAlign: "center", // "left" | "center"
  showBack: true,
  hideRight: false,
  rightActions: [], // { key, label, icon, onClick, className }[]
  rightSlot: null,
};

function HeaderProvider({ children }) {
  const [headerState, setHeaderState] = useState({});

  const setHeader = (partial) => {
    setHeaderState((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const resetHeader = () => setHeaderState({});

  const value = {
    headerState,
    setHeader,
    resetHeader,
  };

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

function useHeader() {
  const ctx = useContext(HeaderContext);
  if (!ctx) {
    throw new Error("useHeader must be used within HeaderProvider");
  }
  return ctx;
}

export { HeaderProvider, useHeader };
