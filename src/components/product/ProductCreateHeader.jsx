import { ChevronLeft, Share2 } from "lucide-react";

const ProductCreateHeader = () => {
  return (
    <div className="flex justify-between items-center px-2 py-2">
      <ChevronLeft className="p-0.3 text-gray-800" />
      <span className="text-lg font-semibold">상품 등록</span>
      <button className="text-sm text-gray-500">임시 저장</button>
    </div>
  );
};

export default ProductCreateHeader;
