import { apiClient } from "@/common/client";

//상품 등록용 자주 쓰는 문구 목록 조회
export const getProductCustomTextsApi = async ({ contentType }) => {
  const { data } = await apiClient("/api/product/custom-texts", {
    params: { contentType }, // PRODUCT | CHAT
    method: "GET",
  });
  return data;
};

//자주 쓰는 문구 등록
export const createProductCustomTextApi = async (contentType, text) => {
  await apiClient("/api/product/custom-texts", {
    method: "POST",
    body: {
      contentType, // PRODUCT | CHAT
      text,
    },
  });
};

// 자주 쓰는 문구 삭제
export const deleteProductCustomTextApi = async (id) => {
  await apiClient(`/api/product/custom-texts/${id}`, {
    method: "DELETE",
  });
};

// 자주 쓰는 문구 수정
export const updateProductCustomTextApi = async (id, text) => {
  await apiClient(`/api/product/custom-texts/${id}`, {
    method: "PUT",
    //body: JSON.stringify({ text }),// 이미 apiClient내부에서 JSON.stringify(body) 처리하므로 수정
    body: { text },
  });
};
