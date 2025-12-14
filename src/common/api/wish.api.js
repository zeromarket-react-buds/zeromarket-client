// wish.api.js
import { apiClient } from "@/common/client";

// 상품 찜 토글
export const toggleWishApi = async (productId) => {
  const { data } = await apiClient(`/api/products/${productId}/wish`, {
    method: "POST",
  });
  return data; // true or false
};

// 셀러샵 찜 토글 ✅
export const toggleSellerLikeApi = async (sellerId) => {
  const { data } = await apiClient(`/api/sellershop/${sellerId}/like`, {
    method: "POST",
  });
  return data; // { liked: true/false }
};

// 내가 찜한 셀러 목록 ✅
export const getLikedSellersApi = async () => {
  const { data } = await apiClient("/api/me/wishlist/sellers", {
    method: "GET",
  });
  return data; // List<LikedSellerResponse>
};
