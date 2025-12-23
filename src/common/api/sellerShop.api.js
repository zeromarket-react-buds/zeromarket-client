import { apiClient } from "@/common/client";

const getProductsBySeller = async ({
  sellerId,
  cursorProductId = null,
  cursorCreatedAt = null,
  size = 10,
  includeHidden = false,
}) => {
  const { data } = await apiClient(`/api/sellers/${sellerId}/products`, {
    params: {
      ...(cursorProductId && { cursorProductId }),
      ...(cursorCreatedAt && { cursorCreatedAt }),
      includeHidden,
      size,
    },
  });
  // cursorProductId / cursorCreatedAt가 null이면
  // params에 아예 포함되지 않음
  // MyBatis <if test="cursorCreatedAt != null"> 분기에서 Cursor 조건을 건너뜀

  return data;
};

// 멤버 프로필 정보 조회 (셀러샵 사용)
const getMemberProfile = async (memberId) => {
  const { data } = await apiClient(`/api/members/${memberId}/profile`);
  return data;
};

// 셀러 찜 토글 wish.api.js로 분리
// const toggleSellerLikeApi = async (sellerId) => {
//   const { data } = await apiClient(`/api/sellershop/${sellerId}/like`, {
//     method: "POST",
//   });

//   return data;
// };

export { getProductsBySeller, getMemberProfile };
