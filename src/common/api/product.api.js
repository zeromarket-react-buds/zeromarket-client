import { apiClient } from "@/common/client";

const getProductListApi = async (query = {}) => {
  //const params = new URLSearchParams();
  const params = {}; //수정: URLSearchParams → 객체

  if (query.offset != null) params.offset = query.offset;
  if (query.sort) params.sort = query.sort;
  if (query.keyword?.trim()) params.keyword = query.keyword.trim();
  if (query.categoryId != null) params.categoryId = query.categoryId;
  if (query.minPrice) params.minPrice = query.minPrice;
  if (query.maxPrice) params.maxPrice = query.maxPrice;
  if (query.area?.trim()) params.area = query.area.trim();

  const { data } = await apiClient("/api/products", {
    method: "GET",
    params, // 수정: apiClient params 사용
  });

  return data;
};

//맵화면경계
const getProductsByMapBoundaryApi = async (
  boundaryQuery = {},
  memberId = 0
) => {
  const params = {
    memberId,

    swLat: boundaryQuery.swLat,
    swLng: boundaryQuery.swLng,
    neLat: boundaryQuery.neLat,
    neLng: boundaryQuery.neLng,
  };

  const { data } = await apiClient("/api/products", {
    method: "GET",
    params,
  });

  return data;
};

// 상품등록 전 Vision
const API_BASE = "http://localhost:8080";

const productVisionApi = async (file) => {
  const accessToken = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/api/products/vision`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      // 브라우저가 boundary 포함해서 자동으로 세팅
    },
    body: formData,
    credentials: "include",
  });

  let data = null;
  try {
    data = await res.clone().json();
  } catch {}

  if (!res.ok) {
    const message = data?.message || "요청에 실패했습니다.";
    throw new Error(message);
  }

  return data;
};

// 상품등록 전 AI 초안 API 요청
const productAiDraftApi = async (payload) => {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(`${API_BASE}/api/products/aidraft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  let data = null;
  try {
    data = await res.clone().json(); // 성공이든 실패든 응답 body를 미리 한 번 안전하게 읽어두기
  } catch {}

  if (!res.ok) {
    const message = data?.message || "요청에 실패했습니다.";
    throw new Error(message);
  }

  return data; // { title, description }
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
const getProductDetailApi = async (id) => {
  const { data } = await apiClient(`/api/products/${id}`, {
    method: "GET",
  });
  return data;
};
// const getProductDetailApi = async (id, memberId = 0) => {
//   //const query = memberId ? `?memberId=${memberId}` : "";
//   // apiClient는 params로 보내야 정상 동작함
//   const params = { memberId }; // 수정됨: 서버가 로그인 사용자 기준으로 isWished 계산 가능

//   //실제 API 호출 URL /api/products/${id}${query}
//   const { data } = await apiClient(`/api/products/${id}`, {
//     method: "GET",
//     params, // 수정됨: apiClient가 자동으로 ?memberId=xxx 붙여줌
//   });

//   return data;
// };

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

// 상품 찜 토글 API
const toggleWishApi = async (productId) => {
  try {
    const { data } = await apiClient(`/api/products/${productId}/wish`, {
      method: "POST",
    });

    // 서버는 true 또는 false를 반환한다고 했음
    return data;
  } catch (error) {
    console.error("찜 토글 API 오류:", error);
    throw error;
  }
};

export {
  getProductListApi,
  getProductsByMapBoundaryApi,
  productVisionApi,
  productAiDraftApi,
  createProductApi,
  updateProductApi,
  getProductDetailApi,
  getSimilarProductsApi,
  fetchLevel1Categories,
  fetchLevel2Categories,
  fetchLevel3Categories,
  ProductHiddenApi,
  deleteProductApi,
  toggleWishApi,
};
