import ProductCard from "@/components/display/ProductCard";

const SimilarProductsSection = ({ products, onToggleLike }) => {
  return (
    <div>
      <div className="mb-20">
        <h3 className="text-lg font-semibold text-gray-800 my-3">
          비슷한 물품
        </h3>
        <ProductCard products={products} onToggleLike={onToggleLike} />
      </div>
    </div>
  );
};
export default SimilarProductsSection;
