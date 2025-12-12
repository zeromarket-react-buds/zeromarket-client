import { apiClient } from "@/common/client";

/**
 * 프로필 설정 페이지에서 로그인한 멤버의 프로필 정보를 조회하는 API
 *
 * GET /api/me/profile
 *
 * @returns {Promise<{
 *   profileImage?: string;
 *   nickname?: string;
 *   introduction?: string;
 * }>} 프로필 데이터
 */
const getProfileApi = async () => {
  const { data } = await apiClient("/api/me/profile");
  return data;
};

/**
 * 프로필 설정 페이지에서 로그인한 멤버의 프로필 정보를 수정하는 API
 *
 * PATCH /api/me/profile
 *
 * @param {Object} params
 * @param {string} [params.profileImage] - 프로필 이미지 URL
 * @param {string} [params.nickname] - 닉네임
 * @param {string} [params.introduction] - 한줄 소개
 *
 * @returns {Promise<any>} 서버에서 반환하는 응답 데이터
 */
const updateProfileApi = async ({ profileImage, nickname, introduction }) => {
  const { data } = await apiClient("/api/me/profile", {
    method: "PATCH",
    body: {
      profileImage,
      nickname,
      introduction,
    },
  });

  return data;
};

/**
 * 닉네임 중복 여부를 확인하는 API
 *
 * 예: GET /api/members/nickname/check?nickname=홍길동
 *
 * @param {string} nickname - 중복 여부를 확인할 닉네임
 * @returns {Promise<boolean>} 이미 존재하면 true, 존재하지 않으면 false
 */
const checkNicknameApi = async (nickname) => {
  const trimmed = nickname.trim();

  // 공백만 있는 경우는 중복 아님으로 처리 (불필요한 요청 안하게)
  if (!trimmed) {
    return false;
  }

  const params = new URLSearchParams();
  params.set("nickname", trimmed);

  const { data } = await apiClient(
    `/api/me/profile/nickname/check?${params.toString()}`,
    {
      method: "GET",
    }
  );

  return data.exists;
};

/**
 * 회원정보 설정 페이지에서 로그인한 멤버의 프로필 정보를 조회하는 API
 *
 * GET /api/me/member
 *
 * @returns {Promise<{
 *   profileImage?: string;
 *   nickname?: string;
 *   phone?: string;
 *   email?: string;
 * }>} 프로필 데이터
 */
const getProfileEditApi = async () => {
  const { data } = await apiClient("/api/members/me/edit");
  return data;
};

export { getProfileApi, updateProfileApi, checkNicknameApi, getProfileEditApi };
