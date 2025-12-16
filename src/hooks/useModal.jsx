import { Button } from "@/components/ui/button";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext(null);

const DESCRIPTION_ID = "modal-description";

export function ModalProvider({ children }) {
  const resolverRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("alert"); // alert | confirm
  const [payload, setPayload] = useState({
    description: "", // 본문
    confirmText: "확인", // 버튼 문구
    cancelText: "취소", // 버튼 문구
    variant: "default", // default: 디폴트 | destructive: 경고창
    closeOnEsc: true, // ESC로 닫을지
    enterToConfirm: true, // Enter로 확인 처리할지
  });

  const closeWith = useCallback((value) => {
    setOpen(false);
    const resolver = resolverRef.current;
    resolverRef.current = null;
    if (resolver) resolver(value);
  }, []);

  // 커스텀 alert창
  const alert = useCallback((options = {}) => {
    setMode("alert");
    setPayload({
      description: options.description ?? "",
      confirmText: options.confirmText ?? "확인",
      cancelText: "취소",
      variant: options.variant ?? "default",
      closeOnEsc: options.closeOnEsc ?? true,
      enterToConfirm: options.enterToConfirm ?? true,
    });
    setOpen(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve; // 확인 누르면 true
    });
  }, []);

  // 커스텀 confirm창
  const confirm = useCallback((options = {}) => {
    setMode("confirm");
    setPayload({
      description: options.description ?? "",
      confirmText: options.confirmText ?? "확인",
      cancelText: options.cancelText ?? "취소",
      variant: options.variant ?? "default",
      closeOnEsc: options.closeOnEsc ?? true,
      enterToConfirm: options.enterToConfirm ?? true,
    });
    setOpen(true);

    return new Promise((resolve) => {
      resolverRef.current = resolve; // 확인 true, 취소 false
    });
  }, []);

  // keydown 처리 규칙
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && payload.closeOnEsc) {
        closeWith(false); // Esc 키를 눌렀을 때 취소 처리
      }
      if (e.key === "Enter" && payload.enterToConfirm) {
        closeWith(true); // Enter 키 입력 시 확인 처리
      }
    },
    [payload.closeOnEsc, payload.enterToConfirm, closeWith]
  );

  // 키보드/스크롤 처리
  useEffect(() => {
    if (!open) return;

    const prev = document.activeElement;
    document.addEventListener("keydown", onKeyDown); // keydown 이벤트 등록 (ESC/Enter 입력 처리)
    document.body.style.overflow = "hidden"; // 모달 떠있는 동안 배경 스크롤 금지

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = ""; //닫힐때 cleanup
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [open, onKeyDown]);

  const value = useMemo(() => ({ alert, confirm }), [alert, confirm]);

  return (
    <ModalContext.Provider value={value}>
      {children}

      {open
        ? createPortal(
            <div className="fixed inset-0 z-50" role="presentation">
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div
                  className="w-full max-w-sm rounded-2xl bg-white shadow-xl"
                  role="dialog"
                  aria-modal="true"
                  aria-describedby={
                    payload.description ? DESCRIPTION_ID : undefined
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-5 pt-5">
                    {payload.description ? (
                      <div
                        id={DESCRIPTION_ID}
                        className="mt-2 text-sm text-black whitespace-pre-line"
                      >
                        {payload.description}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-5 flex gap-2 px-5 pb-5">
                    {/*confirm 모드일 때만 취소 버튼 노출*/}
                    {mode === "confirm" ? (
                      <Button
                        type="button"
                        className="py-2 flex-1 rounded-xl border border-brand-mediumgray text-brand-darkgray text-sm "
                        onClick={() => closeWith(false)}
                      >
                        {payload.cancelText}
                      </Button>
                    ) : null}

                    <Button
                      type="button"
                      className={[
                        "py-2 flex-1 rounded-xl text-sm font-semibold text-white",
                        payload.variant === "destructive"
                          ? "bg-brand-red"
                          : "bg-brand-green",
                      ].join(" ")}
                      onClick={() => closeWith(true)}
                    >
                      {payload.confirmText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("ModalProvider로 감싸야 합니다.");
  return ctx;
}
