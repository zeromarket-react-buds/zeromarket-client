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
const getTradeListApi = async (query = {}) => {
  const params = new URLSearchParams();

  const { keyword, role, status, fromDate, toDate } = query;

  if (keyword && keyword.trim()) params.set("keyword", keyword.trim());
  if (role) params.set("role", role);

  if (Array.isArray(status)) {
    status.forEach((s) => params.append("status", s));
  } else if (status) {
    params.set("status", status);
  }

  // LocalDate로 백엔드에서 처리. yyyy-MM-dd 문자열 전송
  const toDateString = (value) => {
    if (!value) return null;

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  if (fromDate) params.set("fromDate", toDateString(fromDate));
  if (toDate) params.set("toDate", toDateString(toDate));

  const qs = params.toString();
  const url = qs ? `/api/trades?${qs}` : "/api/trades";

  const { data } = await apiClient(url, { method: "GET" });
  return data; // List<TradeHistoryResponse>
};

// 거래 상세 조회 (거래내역 상세 화면용)
export async function getTradeDetailApi(tradeId) {
  const { data } = await apiClient(`/api/trades/${tradeId}`, {
    method: "GET",
  });

  return data; //
}

// 거래 상태 변경 (판매내역/구매내역용)
const updateTradeStatusApi = async ({ tradeId, nextStatus }) => {
  const { data } = await apiClient(`/api/trades/${tradeId}/status`, {
    method: "PATCH",
    body: {
      status: nextStatus,
    },
  });

  return data;
};

// 거래 목록에서 소프트 딜리트 (판매내역/구매내역용)
const softDeleteTradeApi = async ({ tradeId, deletedBy }) => {
  const { data } = await apiClient(`/api/trades/${tradeId}/delete`, {
    method: "PATCH",
    body: {
      deletedBy, // SELLER / BUYER
    },
  });

  return data;
};

/**
 * 특정 거래 상세 조회 (리뷰 작성 전 필요한 정보)
 * GET /api/trades/{tradeId}
 *
 * 로그인한 사용자 정보를 기반으로 상대 닉네임이 계산되어 내려옴
 */
const getTradeInfoForReviewApi = async (tradeId) => {
  const { data } = await apiClient(`/api/trades/reviews/${tradeId}`);
  return data; // TradeReviewInfoDto
};
export {
  getTradeListApi,
  updateTradeStatusApi,
  softDeleteTradeApi,
  getTradeInfoForReviewApi,
};
