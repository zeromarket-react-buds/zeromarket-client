import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductFilter from "@/components/ProductFilter";

const ProductList = () => {
  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div>
        <Input placeholder="어떤 상품을 찾으시나요?" />
      </div>
      <ProductFilter />
      <ProductCard />
      <Button className="font-semibold bg-brand-green text-brand-ivory px-4 py-2 rounded-md">
        더 보기
      </Button>
    </div>
  );
};

export default ProductList;
