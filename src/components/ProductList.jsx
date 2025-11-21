import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

const ProductList = () => {
  return (
    <div>
      <div className="p-2">
        <Input placeholder="어떤 상품을 찾으시나요?" />
      </div>
      <div className="grid grid-cols-2 gap-6 p-2">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
      <div>
        <button className="bg-brand-green text-white px-4 py-2 rounded-md">
          그린 테스트
        </button>

        <button className="bg-brand-darkgray text-white px-4 py-2 rounded-md">
          다크그레이 테스트
        </button>
        <Button className="bg-brand-darkgray text-white">테스트</Button>
      </div>
    </div>
  );
};

export default ProductList;
