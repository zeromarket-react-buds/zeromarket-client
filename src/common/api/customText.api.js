import { apiClient } from "@/common/client";

/**
 * 상품 등록용 자주 쓰는 문구 목록 조회
 */
export const getProductCustomTextsApi = async () => {
  const { data } = await apiClient("/api/product/custom-texts", {
    method: "GET",
  });
  return data;
};

//상품 등록용 자주 쓰는 문구 등록
export const createProductCustomTextApi = async (text) => {
  await apiClient("/api/product/custom-texts", {
    method: "POST",
    body: {
      text,
    },
  });
};
