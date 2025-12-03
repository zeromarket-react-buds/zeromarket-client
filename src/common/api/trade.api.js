import { apiClient } from "@/common/client";

/**
 * 거래 목록 조회 (검색 포함)
 * GET /api/trades
 *
 * @param {Object} query - 검색 필터 (TradeHistoryRequest)
 *  예)
 *   {
 *      status: "COMPLETED",
 *      page: 1,
 *      size: 10,
 *      type: "DIRECT"
 *   }
 */
export async function getTradeListApi(query = {}) {
  const { data } = await apiClient("/api/trades", {
    method: "GET",
    params: query,
  });

  return data; // List<TradeHistoryResponse>
}

/**
 * 특정 거래 상세 조회 (리뷰 작성 전 필요한 정보)
 * GET /api/trades/{tradeId}
 *
 * 로그인한 사용자 정보를 기반으로 상대 닉네임이 계산되어 내려옴
 */
export async function getTradeInfoForReviewApi(tradeId) {
  const { data } = await apiClient(`/api/trades/reviews/${tradeId}`);
  return data; // TradeReviewInfoDto
}
