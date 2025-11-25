import { refreshAccessToken, handleLogout } from "./token";
import { ApiError } from "./error";

const API_BASE = "http://localhost:8080";

// 기본 옵션
const defaultOptions = {
  timeout: 5000,
};

const apiClient = async (
  // 화살표 함수 변경! export는 마지막에!
  url,
  { method = "GET", headers = {}, body, params, timeout = 5000 } = {}
) => {
  const accessToken = localStorage.getItem("accessToken");

  // Query Params 처리
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;

  try {
    response = await fetch(`${API_BASE}${url}${queryString}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortController.signal,
    });
  } catch (error) {
    clearTimeout(timer);
    throw new ApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "서버에 연결할 수 없습니다.",
    });
  }

  clearTimeout(timer);

  // ✅ 여기서부터 ky/axios 기능 구현됨
  let data = null;

  try {
    data = await response.clone().json();
  } catch {
    data = null;
  }

  // ✅ 401 처리 (401 & 토큰 만료 --> refresh flow + 재요청)
  if (response.status === 401 && data?.code === "TOKEN_EXPIRED") {
    try {
      const newToken = await refreshAccessToken();

      return apiClient(url, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
        body,
        params,
      }); // 왜 재요청할 때는 url에 쿼리 부착, body json 변환 등을 안해?
    } catch {
      handleLogout();
      throw new ApiError({
        status: 401,
        code: "SESSION_EXPIRED",
        message: "로그인이 만료되었습니다.",
      });
    }
  }

  // ✅ 응답 실패 시 자동 throw (axios 스타일)
  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: data?.code || "REQUEST_FAILED",
      message: data?.message || "요청에 실패했습니다.",
    });
  }

  // ✅ ky/axios 스타일 반환 구조
  return {
    status: response.status,
    headers: response.headers,
    data,
  };
};

export { apiClient };

// - baseURL
// - headers
// - 인터셉터
// - refresh 처리

// client.js가 자동으로 해줘야 할 것:
// ✅ JSON 자동 파싱
// ✅ status 200~299 아니면 자동 예외 발생
// ✅ 공통 에러 객체 생성
// ✅ timeout 지원
// ✅ query params 지원
// ✅ response.data 스타일 반환
