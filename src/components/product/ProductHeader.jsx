import { ChevronLeft, Share2 } from "lucide-react";

const ProductHeader = ({ type }) => {
  return (
    <div>
      {/* 상품 등록 상단바 */}
      {type === "register" && (
        <div className="flex justify-between items-center px-2 py-4 ">
          <ChevronLeft className="p-0.3 ml-4 stroke-3" />
          <span className="text-xl font-semibold">상품 등록</span>
          <button className="text-sm font-semibold text-gray-500 mr-4">
            임시 저장
          </button>
        </div>
      )}

      {/* 상품 상세 상단바 */}
      {type === "detail" && (
        <div className="flex justify-between items-center px-2 py-2">
          <ChevronLeft className="p-0.3 text-gray-800" />
          <Share2 className="m-2 mr-3 text-gray-800" />
        </div>
      )}
    </div>
  );
};

export default ProductHeader;
