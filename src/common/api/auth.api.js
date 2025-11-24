import { apiClient } from "@/common/client";

// 로그인
export async function loginApi(loginId, password) {
  const { data } = await apiClient("/api/auth/login", {
    method: "POST",
    body: { loginId, password },
  });

  return data; // { accessToken, refreshToken }
}

// 회원가입
export async function registerApi(email, password) {
  const { data } = await apiClient("/api/auth/register", {
    method: "POST",
    body: { email, password },
  });

  return data;
}

// refresh token 요청 (일반적으로 직접 호출할 일은 거의 없음)
export async function refreshTokenApi(refreshToken) {
  const { data } = await apiClient("/api/auth/refresh", {
    method: "POST",
    body: { refreshToken },
  });

  return data; // { accessToken }
}

// 내 정보 조회(테스트용)
export async function getMyInfo() {
  const { data } = await apiClient("/api/users/me");
  return data;
}
