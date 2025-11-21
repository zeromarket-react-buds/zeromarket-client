import { Filter } from "lucide-react";

const ProductFilter = () => {
  return (
    <div className="flex justify-between items-center px-2">
      <Filter className="w-5 h-5" />
      <div className="text-sm">인기순 | 최신순 | 낮은 가격순 | 높은가격순</div>
    </div>
  );
};

export default ProductFilter;
