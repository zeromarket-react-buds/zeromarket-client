import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import ProductFilter from "./ProductFilter";

const ProductList = () => {
  return (
    <div className="flex flex-col p-2 gap-4">
      <div>
        <Input placeholder="어떤 상품을 찾으시나요?" />
      </div>
      <ProductFilter />
      <div className="grid grid-cols-2 gap-4">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <Button className=" bg-brand-green text-brand-ivory px-4 py-2 rounded-md">
        더 보기
      </Button>
    </div>
  );
};

export default ProductList;
