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
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === productId ? { ...p, isWished: newState } : p
        )
      );

      return newState;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  //상품상세
  const onToggleLikeDetail = async (productId) => {
    try {
      // ⭐ fetch 대신 team apiClient 기반 API 호출
      const newState = await toggleWishApi(productId); // true 또는 false

      // ⭐ UI 상태 업데이트
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === productId ? { ...p, isWished: newState } : p
        )
      );

      return newState;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  
  return { products, setProducts, onToggleLike };
};
