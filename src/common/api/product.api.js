import { apiClient } from "@/common/client";

const getProductListApi = async (query = {}) => {
  const params = new URLSearchParams();

  if (query.offset != null) {
    params.set("offset", query.offset);
  }
  if (query.sort) {
    params.set("sort", query.sort);
  }
  if (query.keyword && query.keyword.trim()) {
    params.set("keyword", query.keyword.trim());
  }
  if (query.categoryId != null) {
    params.set("categoryId", query.categoryId);
  }
  if (query.minPrice) {
    params.set("minPrice", query.minPrice);
  }
  if (query.maxPrice) {
    params.set("maxPrice", query.maxPrice);
  }
  if (query.area && query.area.trim()) {
    params.set("area", query.area.trim());
  }

  const qs = params.toString();
  const url = qs ? `/api/products?${qs}` : "/api/products";

  const { data } = await apiClient(url, {
    method: "GET",
  });

  return data;
};

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
export { getProductListApi, getProductDetailApi, getSimilarProductsApi };
