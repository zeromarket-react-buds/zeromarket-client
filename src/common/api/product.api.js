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

//상품등록
const createProductApi = async (productData) => {
  try {
    const response = await apiClient("/api/products", {
      method: "POST",
      body: productData,
    });
    return response.data;
  } catch (error) {
    // 네트워크 오류나 서버 오류 발생시
    console.error("API 에러 발생:", error);
    throw error;
  }
};

/**
 * 상품 수정 API 호출 (PATCH /api/products/{id})
 * @param {number} id - 상품 ID
 * @param {object} productData - 수정 데이터 (JSON body)
 * @returns {object} { ok: boolean } 형태의 성공/실패 객체
 */
const updateProductApi = async (id, productData) => {
  try {
    const { status, data } = await apiClient(`/api/products/${id}`, {
      method: "PATCH",
      body: productData, // 상품 수정 데이터 (이미지 URL 포함)
    });
    if (status >= 200 && status < 300) {
      return { ok: true, data: data };
    }
    return { ok: false, data: data };
  } catch (error) {
    console.error("상품 수정 오류:", error);
    throw error;
  }
};

//상품상세
// const getProductDetailApi = async (id) => {
//   const { data } = await apiClient(`/api/products/${id}`, {
//     method: "GET",
//   });
//   return data;
// };
const getProductDetailApi = async (id, memberId) => {
  const query = memberId ? `?memberId=${memberId}` : "";

  //실제 API 호출 URL /api/products/${id}${query}
  const { data } = await apiClient(`/api/products/${id}${query}`, {
    method: "GET",
  });

  return data;
};

//비슷한상품
const getSimilarProductsApi = async (id) => {
  const { data } = await apiClient(`/api/products/${id}/similar`, {
    method: "GET",
  });
  return data;
};

//카테고리
const fetchLevel1Categories = async () => {
  try {
    const response = await apiClient("/api/categories/level1", {
      method: "GET",
    });

    return response.data;
  } catch (error) {
    console.error("fetchLevel1Categories 오류:", error);
    throw error;
  }
};

/**
 * Level 2 카테고리 데이터 가져오기
 * @param {number} parentId - 부모 카테고리 ID
 */

const fetchLevel2Categories = async (parentId) => {
  try {
    const response = await apiClient(
      `/api/categories/level2?parentId=${parentId}`,
      {
        method: "GET",
      }
    );

    return response.data;
  } catch (error) {
    console.error("fetchLevel2Categories 오류:", error);
    throw error;
  }
};

/**
 * Level 3 카테고리 데이터 가져오기
@param {number} parentId - 부모 카테고리 ID
 */

const fetchLevel3Categories = async (parentId) => {
  try {
    const response = await apiClient(
      `/api/categories/level3?parentId=${parentId}`,
      {
        method: "GET",
      }
    );

    return response.data;
  } catch (error) {
    console.error("fetchLevel3Categories 오류:", error);
    throw error;
  }
};

//상품숨기기버튼
const ProductHiddenApi = async (productId, isHidden) => {
  try {
    //apiClient 성공 시 { status, headers, data }를 반환, 200~299가 아니면 예외 던짐
    await apiClient(`/api/products/${productId}/hide`, {
      method: "PATCH",
      body: { hidden: isHidden },
      // headers: { "Content-Type": "application/json" }, // apiClient가 처리함
    });

    // 성공하면 { success: true } 반환
    return { success: true };
  } catch (error) {
    console.error("상품 숨김/해제 오류:", error);
    throw error; // 에러 전파
  }
};

//상품삭제버튼
const deleteProductApi = async (productId) => {
  try {
    await apiClient(`/api/products/${productId}`, {
      method: "DELETE",
    });

    return { success: true };
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    throw error;
  }
};

export {
  getProductListApi,
  createProductApi,
  updateProductApi,
  getProductDetailApi,
  getSimilarProductsApi,
  fetchLevel1Categories,
  fetchLevel2Categories,
  fetchLevel3Categories,
  ProductHiddenApi,
  deleteProductApi,
};
