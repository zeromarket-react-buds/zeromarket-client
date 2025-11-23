import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductFilter from "@/components/display/ProductFilter";
import { Search } from "lucide-react";

const ProductList = () => {
  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div className="relative w-full">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
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
