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
 * 마이페이지에서 보여줄 받은 후기 갯수 카운트
 */
export const getCountReceivedReviewsOnMyPage = async (memberId) => {
  const { data } = await apiClient(`/api/reviews/received/count/${memberId}`);
  return data;
};

/**
 * 특정 회원이 받은 리뷰 요약 (평점별 3개씩 + 총 개수)
 * @param {number|null} memberId - 회원 ID (없으면 본인)
 */
export const getReceivedReviewSummaryApi = async (memberId = null) => {
  const endpoint = memberId
    ? `/api/reviews/received/summary/${memberId}`
    : `/api/reviews/received/summary`;

  const { data } = await apiClient(endpoint);
  return data;
};

/**
 * 특정 회원이 받은 리뷰 전체 목록 (특정 평점 기준, 페이징 포함)
 * @param {number|null} memberId - 회원 ID (없으면 본인)
 * @param {number} rating - 평점 (4 또는 5)
 * @param {number|null} cursorReviewId - 커서 리뷰 ID
 * @param {string|null} cursorCreatedAt - 커서 생성일
 * @param {number} size - 페이지 크기
 */
export const getReceivedReviewsByRatingApi = async ({
  memberId = null,
  rating,
  cursorReviewId = null,
  cursorCreatedAt = null,
  size = 10,
} = {}) => {
  const endpoint = memberId
    ? `/api/reviews/received/${memberId}`
    : `/api/reviews/received`;

  const { data } = await apiClient(endpoint, {
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
