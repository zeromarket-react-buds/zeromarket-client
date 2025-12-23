import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import {
  getAccessToken,
  refreshAccessToken,
  handleLogout,
} from "@/common/token";

const WS_BASE = import.meta.env.VITE_SERVER_URL;

// ===== 싱글턴 상태 =====
let client = null;
let activating = false;

// dest -> callback
const subscriptions = new Map();
// dest -> stomp subscription object
const activeSubs = new Map();

// 상태 리스너(선택)
const statusListeners = new Set();

function emitStatus(status, extra) {
  statusListeners.forEach((fn) => {
    try {
      fn(status, extra);
    } catch (e) {}
  });
}

function buildClient({ debug } = {}) {
  const token = getAccessToken();

  const c = new Client({
    webSocketFactory: () => new SockJS(`${WS_BASE}/ws`),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: (s) => {
      // console.log("[stomp]", s);
    },
  });

  // 연결되면 저장해둔 구독 전부 복구
  c.onConnect = () => {
    emitStatus("connected");
    resubscribeAll();
  };

  // 연결 종료
  c.onWebSocketClose = (evt) => {
    emitStatus("disconnected", evt);
  };

  // STOMP 에러 프레임
  c.onStompError = (frame) => {
    emitStatus("stomp-error", frame);
  };

  // 웹소켓 에러(인증 만료 가능) → refresh 1회 후 재연결
  c.onWebSocketError = async () => {
    emitStatus("ws-error");
    // 너무 자주 중복 실행되는 것 방지
    if (activating) return;

    try {
      activating = true;
      await refreshAccessToken();

      // 기존 세션 정리
      try {
        c.deactivate();
      } catch (e) {}

      // 새 토큰으로 새 client 생성 + 재연결
      client = buildClient({ debug });
      client.activate();
      emitStatus("reconnected");
    } catch (e) {
      handleLogout();
      console.error("WS auth failed. logged out.", e);
      emitStatus("auth-failed", e);
    } finally {
      activating = false;
    }
  };

  return c;
}

function ensureClient(opts = {}) {
  if (client) return client;
  client = buildClient(opts);
  return client;
}

function activate(opts = {}) {
  const c = ensureClient(opts);
  if (!c.active) {
    emitStatus("connecting");
    c.activate();
  }
  return c;
}

/**
 * 구독을 등록하고, 연결되면 실제 subscribe 수행.
 * 재연결 시 자동 재구독됨.
 *
 * @returns unsubscribe 함수
 */
function subscribe(dest, callback, opts = {}) {
  subscriptions.set(dest, callback);

  const c = activate(opts);

  // 이미 연결된 상태면 즉시 구독
  if (c.connected) {
    const sub = c.subscribe(dest, (frame) => {
      try {
        const parsed = frame?.body ? JSON.parse(frame.body) : null;
        callback(parsed, frame);
      } catch (e) {
        callback(frame?.body, frame);
      }
    });
    activeSubs.set(dest, sub);
  }

  return () => {
    subscriptions.delete(dest);

    const sub = activeSubs.get(dest);
    if (sub) {
      try {
        sub.unsubscribe();
      } catch (e) {}
      activeSubs.delete(dest);
    }
  };
}

/**
 * 연결 복구 시(또는 첫 connect 시) 전체 구독 재등록
 */
function resubscribeAll() {
  if (!client?.connected) return;

  // 기존 sub 객체는 무효가 될 수 있으니 일괄 정리 후 재등록
  activeSubs.forEach((sub) => {
    try {
      sub.unsubscribe();
    } catch (e) {}
  });
  activeSubs.clear();

  subscriptions.forEach((callback, dest) => {
    const sub = client.subscribe(dest, (frame) => {
      try {
        const parsed = frame?.body ? JSON.parse(frame.body) : null;
        callback(parsed, frame);
      } catch (e) {
        callback(frame?.body, frame);
      }
    });
    activeSubs.set(dest, sub);
  });
}

/**
 * publish(send)
 */
function publish(destination, payload, opts = {}) {
  const c = activate(opts);
  if (!c.connected) return false;

  c.publish({
    destination,
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
  return true;
}

/**
 * 로그아웃/앱 종료 시 호출 추천
 */
function deactivate() {
  if (!client) return;

  // 구독 정리
  activeSubs.forEach((sub) => {
    try {
      sub.unsubscribe();
    } catch (e) {}
  });
  activeSubs.clear();
  subscriptions.clear();

  try {
    client.deactivate();
  } catch (e) {}
  client = null;

  emitStatus("deactivated");
}

/**
 * 상태 변화 구독(선택)
 */
function onStatusChange(fn) {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

/**
 * 기존 createChatClient() 호출부를 최대한 안 깨려면:
 * - "client 인스턴스"를 리턴하지 말고, 싱글턴 API를 리턴하는 게 안전함.
 */
export function createChatClient(options = {}) {
  // options.debug를 계속 쓰고 싶으면 여기서 전달
  return {
    activate: () => activate(options),
    deactivate,
    subscribe: (dest, cb) => subscribe(dest, cb, options),
    publish: (destination, payload) => publish(destination, payload, options),
    onStatusChange,
    get connected() {
      return !!client?.connected;
    },
    // 필요하면 원본 Client 접근도 제공
    get raw() {
      return client;
    },
  };
}
