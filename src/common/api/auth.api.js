import { apiClient } from "@/common/client";

// 로그인
export const loginApi = async (loginId, password) => {
  const { data } = await apiClient("/api/auth/login", {
    method: "POST",
    body: { loginId, password },
  });

  return data; // { accessToken }
};

// 회원가입
export const registerApi = async (form) => {
  const { data } = await apiClient("/api/auth/signup", {
    method: "POST",
    body: form,
  });

  return data;
};

// refresh token 요청 (일반적으로 직접 호출할 일은 거의 없음)
// export const refreshTokenApi = async (refreshToken) => {
//   const { data } = await apiClient("/api/auth/refresh", {
//     method: "POST",
//     body: { refreshToken },
//   });

//   return data; // { accessToken }
// };

// 내 정보 조회
export const getMyInfoApi = async () => {
  const { data } = await apiClient("/api/members/me");
  return data;
};

// 아이디 중복 체크
export const checkDuplicateIdApi = async (id) => {
  const { data } = await apiClient(`/api/auth/check-id?loginId=${id}`);
  return data;
};

// 로그아웃
export const logoutApi = async () => {
  const { data } = await apiClient(`/api/auth/logout`);
  return data;
};
