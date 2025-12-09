import { apiClient } from "@/common/client";

// 프로필 설정 페이지에서 멤버 프로필 읽는용
const getProfileApi = async () => {
  const { data } = await apiClient("/api/me/profile");
  return data;
};

const updateProfileApi = async ({ profileImage, nickname, introduction }) => {
  const { data } = await apiClient(`/api/me/profile`, {
    method: "PATCH",
    body: {
      profileImage,
      nickname,
      introduction,
    },
  });

  return data;
};

export { getProfileApi, updateProfileApi };
