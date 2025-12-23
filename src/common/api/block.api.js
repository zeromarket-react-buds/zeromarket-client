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

/**
 * 셀러샵 페이지에서 해당 유저가 차단 유저인지 조회하는 API
 *
 * GET /api/block/status?targetId={sellerId}
 *
 * @param {number} targetId -- 차단 여부를 확인할 셀러 ID
 * @returns {Promise<{ isBlocked: boolean }>}
 */
const getTargetIdIsBlockedApi = async (targetId) => {
  const { data } = await apiClient(`/api/block/status`, {
    params: { targetId },
  });
  return data;
};

/**
 *  다른 페이지(예: 셀러샵/채팅)에서 대상 유저를 차단 등록하는 API
 *
 * POST /api/block
 *
 * - 인증 필요: 로그인한 사용자 기준으로 차단 등록
 * - 요청 바디: { blockedUserId: number }
 * - 응답(서버): { blockId: number, message: string } 형태 (컨트롤러의 BlockCreateResponse)
 *
 * @param {{ blockedUserId: number }} payload -- 차단할 대상 유저의 memberId
 * @returns {Promise<{ blockId: number, message: string }>} -- 생성된 blockId 및 안내 메시지
 */
const createBlockApi = async (payload) => {
  try {
    const response = await apiClient("/api/block", {
      method: "POST",
      body: payload,
    });
    return response.data;
  } catch (error) {
    console.error("차단 유저 등록 API 에러 발생:", error);
    throw error;
  }
};

export {
  getBlockListApi,
  getTargetIdIsBlockedApi,
  createBlockApi,
  updateUnblockApi,
};
