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

// ⭐ 백엔드 연동 찜 토글 훅
export const useLikeToggle = () => {
  const [products, setProducts] = useState([]);

  const onToggleLike = async (productId) => {
    try {
      // 🔥 백엔드 찜 토글 API 호출
      const res = await fetch(
        `http://localhost:8080/api/products/${productId}/wish`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("찜 토글 실패");

      // 백엔드 응답: 찜됨(true) / 삭제됨(false)
      const liked = await res.json();

      // 프론트 UI 반영
      setProducts((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, liked } : p))
      );

      return liked;
    } catch (err) {
      console.error("찜 API 오류:", err);
    }
  };

  return { products, setProducts, onToggleLike };
};
