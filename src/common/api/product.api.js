import { apiClient } from "@/common/client";

const getProductDetailApi = async (id) => {
  const { data } = await apiClient(`/api/products/${id}`, {
    method: "GET",
  });
  return data;
};

const getSimilarProductsApi = async (id) => {
  const { data } = await apiClient(`/api/products/${id}/similar`, {
    method: "GET",
  });
  return data;
};
export { getProductDetailApi, getSimilarProductsApi };
