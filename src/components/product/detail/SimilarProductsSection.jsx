import ProductCard from "@/components/display/ProductCard";
import { getSimilarProductsApi } from "@/common/api/product.api";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useEffect } from "react";

const SimilarProductsSection = ({ productId }) => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);

  useEffect(() => {
    if (!productId) return;

    const loadData = async () => {
      try {
        const data = await getSimilarProductsApi(productId);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.content) {
          setProducts(data.content);
        }
        // setProducts(data);
      } catch (error) {
        console.error("비슷한 상품 조회 실패:", error);
      }
    };
    loadData();
  }, [productId, setProducts]);

  if (!products || products.length === 0) return null;

  return (
    <div>
      <div className="mb-20">
        <h3 className="text-lg font-semibold text-gray-800 my-3">
          비슷한 물품
        </h3>
        <ProductCard
          products={products}
          onToggleLikeInProductList={onToggleLike}
        />
      </div>
    </div>
  );
};
export default SimilarProductsSection;
