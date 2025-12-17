import { apiClient } from "@/common/client";

/**
 * 차단 유저 목록 페이지에서 로그인한 멤버의 차단 유저 정보를 조회하는 API
 *
 * GET /api/block/list
 *
 * @returns {Promise<{
 *   profileImage? : String;
 *   nickname?: string;
 *   blockedUserCount?: number;
 *   blockedUserNickname?: string;
 * }>} 프로필 데이터
 */
const getBlockListApi = async () => {
  const { data } = await apiClient(`/api/block/list`);
  return data;
};

/**
 * 차단 유저 목록 페이지에서 클릭한 유저를 차단해제하는 API
 *
 * PATCH /api/block/{blockId}
 * @param {number} blockId
 */
const updateUnblockApi = async (blockId) => {
  const { data } = await apiClient(`/api/block/${blockId}`, {
    method: "PATCH",
  });

  return data;
};

export { getBlockListApi, updateUnblockApi };
