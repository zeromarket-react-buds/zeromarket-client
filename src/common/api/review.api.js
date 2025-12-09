import { apiClient } from "@/common/client";

/**
 * 리뷰 생성 (POST /api/reviews)
 */
export const createReviewApi = async (review) => {
  const { data } = await apiClient(`/api/reviews`, {
    method: "POST",
    body: review,
  });
  return data; // reviewId(Long)
};

/**
 * 리뷰 ID로 조회 (GET /api/reviews/{reviewId})
 */
export const getReviewByIdApi = async (reviewId) => {
  const { data } = await apiClient(`/api/reviews/${reviewId}`);
  return data;
};

/**
 * 특정 회원이 받은 리뷰 요약 (평점별 3개씩 + 총 개수)
 */
export const getReceivedReviewSummaryApi = async () => {
  const { data } = await apiClient(`/api/reviews/received/summary`);
  return data;
};

/**
 * 특정 회원이 받은 리뷰 전체 목록 (특정 평점 기준, 페이징 포함)
 */
export const getReceivedReviewsByRatingApi = async ({
  rating,
  cursorReviewId = null,
  cursorCreatedAt = null,
  size = 10,
} = {}) => {
  const { data } = await apiClient(`/api/reviews/received`, {
    params: {
      rating,
      size,
      ...(cursorReviewId && { cursorReviewId }),
      ...(cursorCreatedAt && { cursorCreatedAt }),
    },
  });
  return data;
};

/**
 * 모든 리뷰 조회 (GET /api/reviews)
 */
export const getAllReviewsApi = async () => {
  const { data } = await apiClient(`/api/reviews`);
  return data;
};

/**
 * 작성자 ID로 조회 (GET /api/reviews/writer/{writerId})
 */
export const getReviewsByWriterIdApi = async (writerId) => {
  const { data } = await apiClient(`/api/reviews/writer/${writerId}`);
  return data;
};

/**
 * 거래 ID로 조회 (GET /api/reviews/trade/{tradeId})
 */
export const getReviewsByTradeIdApi = async (tradeId) => {
  const { data } = await apiClient(`/api/reviews/trade/${tradeId}`);
  return data;
};

/**
 * 특정 회원이 받은 리뷰 조회 (GET /api/reviews/member/{memberId})
 */
export const getReviewsByMemberIdApi = async (memberId) => {
  const { data } = await apiClient(`/api/reviews/member/${memberId}`);
  return data;
};

/**
 * 평점별 리뷰 조회 (GET /api/reviews/rating/{rating})
 */
export const getReviewsByRatingApi = async (rating) => {
  const { data } = await apiClient(`/api/reviews/rating/${rating}`);
  return data;
};

/**
 * 회원 평균 평점 조회 (GET /api/reviews/member/{memberId}/average-rating)
 */
export const getAverageRatingApi = async (memberId) => {
  const { data } = await apiClient(
    `/api/reviews/member/${memberId}/average-rating`
  );
  return data;
};

/**
 * 리뷰 수정 (PUT /api/reviews/{reviewId})
 */
export const updateReviewApi = async (reviewId, review) => {
  const { data } = await apiClient(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: review,
  });
  return data;
};

/**
 * 리뷰 삭제 (DELETE /api/reviews/{reviewId})
 */
export const deleteReviewApi = async (reviewId) => {
  const { data } = await apiClient(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  return data;
};

/**
 * 리뷰 하드 삭제 (DELETE /api/reviews/{reviewId}/hard)
 */
export const hardDeleteReviewApi = async (reviewId) => {
  const { data } = await apiClient(`/api/reviews/${reviewId}/hard`, {
    method: "DELETE",
  });
  return data;
};
