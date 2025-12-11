// import { useState } from "react";

// // 찜 목록 등록/삭제 토글 함수
// export const useLikeToggle = () => {
//   const [products, setProducts] = useState([]);

//   const onToggleLike = (productId) => {
//     setProducts((prev) =>
//       prev.map((p) =>
//         p.productId === productId ? { ...p, liked: !p.liked } : p
//       )
//     );
//   };

//   return { products, setProducts, onToggleLike };
// };
import { useState } from "react";
import { toggleWishApi } from "@/common/api/wish.api";

export const useLikeToggle = () => {
  const [products, setProducts] = useState([]);

  const onToggleLike = async (productId) => {
    try {
      // ⭐ fetch 대신 team apiClient 기반 API 호출
      const newState = await toggleWishApi(productId); // true 또는 false

      // ⭐ UI 상태 업데이트
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
                isWished: newState,
                wishCount: newState ? p.wishCount + 1 : p.wishCount - 1, // ⭐ 개수 업데이트
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

  // 상품 상세에서 사용하는 찜 토글 (products 상태 건드리지 않음)
  const onToggleLikeDetail = async (productId) => {
    try {
      // ⭐ fetch 대신 team apiClient 기반 API 호출
      const newState = await toggleWishApi(productId); // true 또는 false

      // ❗ 상세 페이지는 products 목록을 건드리면 안 됨
      // 상세 페이지에서 product state를 직접 수정해야 함.
      // // ⭐ UI 상태 업데이트
      // setProducts((prev) =>
      //   prev.map((p) =>
      //     p.productId === productId ? { ...p, isWished: newState } : p
      //   )
      // );

      return newState;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  //onToggleLikeDetail 추가
  return { products, setProducts, onToggleLike, onToggleLikeDetail };
};
