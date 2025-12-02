import { apiClient } from "@/common/client";

/**
 * 리뷰 생성 (POST /api/reviews)
 */
export async function createReviewApi(review) {
  const { data } = await apiClient(`/api/reviews`, {
    method: "POST",
    body: review,
  });
  return data; // reviewId(Long)
}

/**
 * 리뷰 ID로 조회 (GET /api/reviews/{reviewId})
 */
export async function getReviewByIdApi(reviewId) {
  const { data } = await apiClient(`/api/reviews/${reviewId}`);
  return data;
}

/**
 * 모든 리뷰 조회 (GET /api/reviews)
 */
export async function getAllReviewsApi() {
  const { data } = await apiClient(`/api/reviews`);
  return data;
}

/**
 * 작성자 ID로 조회 (GET /api/reviews/writer/{writerId})
 */
export async function getReviewsByWriterIdApi(writerId) {
  const { data } = await apiClient(`/api/reviews/writer/${writerId}`);
  return data;
}

/**
 * 거래 ID로 조회 (GET /api/reviews/trade/{tradeId})
 */
export async function getReviewsByTradeIdApi(tradeId) {
  const { data } = await apiClient(`/api/reviews/trade/${tradeId}`);
  return data;
}

/**
 * 특정 회원이 받은 리뷰 조회 (GET /api/reviews/member/{memberId})
 */
export async function getReviewsByMemberIdApi(memberId) {
  const { data } = await apiClient(`/api/reviews/member/${memberId}`);
  return data;
}

/**
 * 평점별 리뷰 조회 (GET /api/reviews/rating/{rating})
 */
export async function getReviewsByRatingApi(rating) {
  const { data } = await apiClient(`/api/reviews/rating/${rating}`);
  return data;
}

/**
 * 회원 평균 평점 조회 (GET /api/reviews/member/{memberId}/average-rating)
 */
export async function getAverageRatingApi(memberId) {
  const { data } = await apiClient(
    `/api/reviews/member/${memberId}/average-rating`
  );
  return data;
}

/**
 * 리뷰 수정 (PUT /api/reviews/{reviewId})
 */
export async function updateReviewApi(reviewId, review) {
  const { data } = await apiClient(`/api/reviews/${reviewId}`, {
    method: "PUT",
    body: review,
  });
  return data;
}

/**
 * 리뷰 삭제 (DELETE /api/reviews/{reviewId})
 */
export async function deleteReviewApi(reviewId) {
  const { data } = await apiClient(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  return data;
}

/**
 * 리뷰 하드 삭제 (DELETE /api/reviews/{reviewId}/hard)
 */
export async function hardDeleteReviewApi(reviewId) {
  const { data } = await apiClient(`/api/reviews/${reviewId}/hard`, {
    method: "DELETE",
  });
  return data;
}
