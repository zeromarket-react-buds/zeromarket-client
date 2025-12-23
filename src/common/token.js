import { ApiError } from "./error";
import { createChatClient } from "@/lib/chatStompClient";

let isRefreshing = false;
let refreshPromise = null;
const API_BASE = import.meta.env.VITE_SERVER_URL;

// TODO: 쿠키로 refresh token flow 구현

export function handleLogout() {
  localStorage.clear();
  const stomp = createChatClient();
  stomp.deactivate(); // 싱글턴 완전 정리
}

export async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      // console.log("refresh token api 시작");
      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 전달
        body: null,
        // body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new ApiError({ message: "refresh 실패" });

      const { accessToken } = await res.json();

      if (!accessToken) {
        throw new ApiError({
          message: "서버가 엑세스 토큰을 발급하지 않았습니다.",
        });
      }

      // console.log("refresh token + 재요청 성공", accessToken);

      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// oauth 로그인
// const oauthLoginApi = async (code) => {
//   const { data } = await apiClient("/api/oauth/kakao", {
//     method: "POST",
//     body: { code },
//   });
//   return data;
// };

// export const oauthLoginApi = async (code) => {
//   await fetch()
// }
export const getAccessToken = () => localStorage.getItem("accessToken");
