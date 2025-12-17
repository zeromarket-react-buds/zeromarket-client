import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import {
  getAccessToken,
  refreshAccessToken,
  handleLogout,
} from "@/common/token";

const WS_BASE = "http://localhost:8080"; // TODO: 배포시 변경

export function createChatClient({
  onConnect,
  onDisconnect,
  onError,
  debug,
} = {}) {
  const makeClient = () => {
    const token = getAccessToken();

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE}/ws`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: debug ? (s) => console.log("[stomp]", s) : undefined,
    });

    client.onConnect = onConnect;
    client.onWebSocketClose = onDisconnect;

    // STOMP 에러 프레임
    client.onStompError = (frame) => {
      onError?.(frame);
    };

    return client;
  };

  const client = makeClient();

  // 연결 실패/끊김 시 토큰 만료 가능 → 1회 refresh 후 재연결
  client.onWebSocketError = async () => {
    try {
      await refreshAccessToken();
      client.deactivate(); // 기존 세션 정리
      const retryClient = makeClient();
      retryClient.activate();
    } catch (e) {
      handleLogout();
      console.error("WS auth failed. logged out.", e);
    }
  };

  return client;
}
