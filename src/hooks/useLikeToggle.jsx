import { useState } from "react";

// 찜 목록 등록/삭제 토글 함수
export const useLikeToggle = () => {
  const [products, setProducts] = useState([]);

  const onToggleLike = (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, liked: !p.liked } : p
      )
    );
  };

  return { products, setProducts, onToggleLike };
};
