import { Filter } from "lucide-react";
import FilterSideBar from "@/components/FilterSidebar";

const ProductFilter = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-2">
        <Filter className="w-5 h-5" />
        <div className="text-sm">
          인기순 | 최신순 | 낮은 가격순 | 높은가격순
        </div>
      </div>
      <div>
        <FilterSideBar />
      </div>
    </div>
  );
};

export default ProductFilter;
