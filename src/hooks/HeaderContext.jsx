// src/hooks/HeaderContext.jsx
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext(null);

// 헤더 전체 상태 기본값
const defaultHeaderState = {
  title: null,
  titleAlign: "center", // "left" | "center"
  showBack: true,
  hideRight: false,
  rightActions: [], // { key, label, icon, onClick, className }[]
  rightSlot: null,
};

function HeaderProvider({ children }) {
  const [headerState, setHeaderState] = useState(defaultHeaderState);

  const setHeader = (partial) => {
    setHeaderState((prev) => ({
      ...prev,
      ...partial,
    }));
  };

  const resetHeader = () => setHeaderState(defaultHeaderState);

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
