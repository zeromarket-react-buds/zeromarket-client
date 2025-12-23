import { apiClient } from "@/common/client";

// 로그인
const loginApi = async (loginId, password) => {
  const { data } = await apiClient("/api/auth/login", {
    method: "POST",
    body: { loginId, password },
  });

  return data; // { accessToken }
};

// 회원가입
const registerApi = async (form) => {
  const { data } = await apiClient("/api/auth/signup", {
    method: "POST",
    body: form,
  });

  return data;
};

// 내 정보 조회
const getMyInfoApi = async () => {
  const { data } = await apiClient("/api/members/me");
  return data;
};

// 아이디 중복 체크
const checkDuplicateIdApi = async (id) => {
  const { data } = await apiClient(`/api/auth/check-id?loginId=${id}`);
  return data;
};

// 로그아웃
const logoutApi = async () => {
  const { data } = await apiClient(`/api/members/logout`, { method: "POST" });
  return data;
};

// oauth 로그인
const oauthLoginApi = async (code) => {
  const { data } = await apiClient("/api/oauth/kakao", {
    method: "POST",
    body: { code },
  });
  return data;
};

// 회원탈퇴
const withdrawApi = async (payload = {}) => {
  const body = {};
  if (payload.withdrawalReasonId) body.withdrawalReasonId = payload.withdrawalReasonId;
  if (payload.withdrawalReasonDetail) {
    body.withdrawalReasonDetail = payload.withdrawalReasonDetail;
  }

  const { data } = await apiClient(`/api/members/withdraw`, {
    method: "POST",
    body: Object.keys(body).length ? body : undefined,
  });
  return data;
};

export {
  loginApi,
  registerApi,
  getMyInfoApi,
  checkDuplicateIdApi,
  logoutApi,
  oauthLoginApi,
  withdrawApi,
};
