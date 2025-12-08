import { apiClient } from "@/common/client";

// 프로필 설정 페이지에서 멤버 프로필 읽는용
const getProfileApi = async () => {
  const { data } = await apiClient("/api/me/profile");
  return data;
};

export { getProfileApi };
