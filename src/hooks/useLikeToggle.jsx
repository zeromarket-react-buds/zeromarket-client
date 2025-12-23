import { useState } from "react";
import { toggleWishApi } from "@/common/api/wish.api";

// 찜 목록 등록/삭제 토글 함수
export const useLikeToggle = () => {
  const [products, setProducts] = useState([]);

  const onToggleLike = async (productId) => {
    try {
      //  fetch 대신 team apiClient 기반 API 호출
      const res = await toggleWishApi(productId);
      const newState = typeof res === "boolean" ? res : res?.liked;

      //  UI 상태 업데이트
      // setProducts((prev) =>
      //   prev.map((p) =>
      //     p.productId === productId ? { ...p, isWished: newState } : p
      //   )
      // );
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === productId
            ? {
                ...p,
                liked: newState,
                wishCount: newState
                  ? p.wishCount + 1
                  : Math.max(p.wishCount - 1, 0), // 개수 업데이트
              }
            : p
        )
      );

      return newState;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  // 상품 상세에서 사용하는 찜 토글 (목록 상태는 건드리지 않음)
  const onToggleLikeDetail = async (productId) => {
    try {
      //  fetch 대신 team apiClient 기반 API 호출
      const res = await toggleWishApi(productId);
      return typeof res === "boolean" ? res : res?.liked;

      //  상세 페이지는 products 목록을 건드리면 안 됨
      // 상세 페이지에서 product state를 직접 수정해야 함.
      // // UI 상태 업데이트
      // setProducts((prev) =>
      //   prev.map((p) =>
      //     p.productId === productId ? { ...p, isWished: newState } : p
      //   )
      // );
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  //onToggleLikeDetail 추가
  return { products, setProducts, onToggleLike, onToggleLikeDetail };
};
