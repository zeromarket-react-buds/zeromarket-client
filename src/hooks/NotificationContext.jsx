import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { notificationApi } from "@/common/api/notification.api";
import { createChatClient } from "@/lib/chatStompClient";
import { useAuth } from "@/hooks/AuthContext";
import {
  showBrowserNotification,
  requestNotificationPermission,
} from "@/lib/browserNotification";

const NotificationContext = createContext(null);

const STORAGE_KEY = "zm_notification_settings";

const DEFAULT_SETTINGS = {
  doNotDisturb: false,
  chatNotify: false,
  keywordNotify: false,
  noticeNotify: false,
  eventNotify: false,
};

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // settings 로드/저장
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const setSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setSettingWithPermission = useCallback(
    async (key, next) => {
      if (!next) {
        setSetting(key, false);
        return true;
      }
      const ok = await requestNotificationPermission();
      if (!ok) {
        setSetting(key, false);
        return false;
      }
      setSetting(key, true);
      return true;
    },
    [setSetting]
  );

  // 최신 settings를 ref에 저장 (재구독 없이 최신값 읽기)
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // 최신 userId도 ref로(옵션) - 콜백에서 쓸 일이 있으면 유용
  const memberIdRef = useRef(user?.memberId);
  useEffect(() => {
    memberIdRef.current = user?.memberId;
  }, [user?.memberId]);

  const refreshUnreadCount = useCallback(async () => {
    if (!user?.memberId) return;
    try {
      const res = await notificationApi.getUnreadCount();
      const next = typeof res === "number" ? res : res?.count ?? 0;
      setUnreadCount(next);
    } catch (e) {
      console.error("refreshUnreadCount failed", e);
    }
  }, [user?.memberId]);

  // refreshUnreadCount도 ref로 (재구독 없이 최신 함수 사용)
  const refreshUnreadCountRef = useRef(refreshUnreadCount);
  useEffect(() => {
    refreshUnreadCountRef.current = refreshUnreadCount;
  }, [refreshUnreadCount]);

  const isCurrentChatRoom = (chatRoomId) => {
    const match = window.location.pathname.match(/^\/chat\/rooms\/(\d+)/);
    if (!match) return false;
    return Number(match[1]) === Number(chatRoomId);
  };

  useEffect(() => {
    if (!user?.memberId) {
      setUnreadCount(0);
      return;
    }
    refreshUnreadCount();
  }, [user?.memberId, refreshUnreadCount]);

  // 구독 useEffect: settings 의존성 제거 → 토글 바꿔도 재구독 안 함
  const notiSubRef = useRef(null);
  useEffect(() => {
    if (!user?.memberId) return;

    // 이미 구독 중이면 재구독 금지
    if (notiSubRef.current) return;

    const stomp = createChatClient({ debug: true });
    const dest = `/sub/notification/${user.memberId}`;

    const unsubscribe = stomp.subscribe(dest, (payload) => {
      // 항상 최신 refresh 사용
      refreshUnreadCountRef.current?.();

      if (!payload) return;

      // 항상 최신 settings 사용
      const s = settingsRef.current;

      // 방해금지면 브라우저 알림 막기
      if (s.doNotDisturb) return;

      // 채팅 알림
      if (payload.refType === "CHAT_ROOM") {
        if (!s.chatNotify) return;

        if (
          document.visibilityState === "visible" &&
          isCurrentChatRoom(payload.refId)
        ) {
          return;
        }

        showBrowserNotification({
          title: "새 채팅 메시지 💬",
          body: payload.body || "새 메시지가 도착했습니다.",
          onClick: () => {
            if (payload.refId) window.location.href = `/chats/${payload.refId}`;
          },
        });
        return;
      }

      if (payload.refType === "PRODUCT") {
        if (!s.keywordNotify) return;

        if (document.visibilityState === "visible") {
          return;
        }

        showBrowserNotification({
          title: "새 상품 등록 🎁",
          body: payload.body || "새 상품이 등록되었습니다.",
          onClick: () => {
            if (payload.refId)
              window.location.href = `/products/${payload.refId}`;
          },
        });
        return;
      }

      // TODO: keyword/notice/event도 payload.type 등으로 분기하면 동일하게:
      // if (payload.type === "KEYWORD" && s.keywordNotify) { ... }
      // if (payload.type === "NOTICE" && s.noticeNotify) { ... }
      // if (payload.type === "EVENT" && s.eventNotify) { ... }
    });

    notiSubRef.current = unsubscribe;

    stomp.activate();

    return () => {
      try {
        notiSubRef.current?.();
      } catch {}
      notiSubRef.current = null;
    };
  }, [user?.memberId]);

  const value = useMemo(
    () => ({
      unreadCount,
      setUnreadCount,
      refreshUnreadCount,
      settings,
      setSetting,
      setSettingWithPermission,
    }),
    [
      unreadCount,
      refreshUnreadCount,
      settings,
      setSetting,
      setSettingWithPermission,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}
