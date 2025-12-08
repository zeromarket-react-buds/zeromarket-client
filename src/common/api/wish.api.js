// wish.api.js
import { apiClient } from "@/common/client";

export const toggleWishApi = async (productId) => {
  const { data } = await apiClient(`/api/products/${productId}/wish`, {
    method: "POST",
  });
  return data; // true or false
};

export const deleteWishApi = async (productId) => {
  const { data } = await apiClient(`/api/products/${productId}/wish`, {
    method: "DELETE",
  });
  return data;
};
