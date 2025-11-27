import { ChevronLeft, Share2 } from "lucide-react";
import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";

const ProductHeader = ({ type }) => {
  const navigate = useNavigate();
  return (
    <Container>
      {/* 상품 등록 상단바 */}
      {type === "register" && (
        <header className="flex justify-between items-center px-2 pt-4 ">
          <button className="w-15 h-10 cursor-pointer">
            <ChevronLeft
              className="p-0.3 ml-4 stroke-3"
              onClick={() => navigate(-1)}
            />
          </button>
          <span className="text-xl font-semibold">상품 등록</span>
          <button className="text-sm font-semibold text-gray-500 w-15 h-10  mr-4 cursor-pointer">
            임시 저장
          </button>
        </header>
      )}

      {/* 상품 상세 상단바 */}
      {type === "detail" && (
        <header className="flex justify-between items-center px-2 pt-2">
          <button className="w-15 h-10 cursor-pointer">
            <ChevronLeft
              className="p-0.3 ml-4 stroke-3"
              onClick={() => navigate(-1)}
            />
          </button>
          <button className="w-15 h-10 cursor-pointer">
            <Share2 className="m-2 mr-3 text-gray-800" />
          </button>
        </header>
      )}

      {/* 상품 수정 상단바 */}
      {type === "edit" && (
        <header className="flex justify-between items-center px-2 pt-4 ">
          <button className="w-15 h-10 cursor-pointer">
            <ChevronLeft
              className="p-0.3 ml-4 stroke-3"
              onClick={() => navigate(-1)}
            />
          </button>
          <span className="text-xl font-semibold">상품 수정</span>
          <button className="text-sm font-semibold text-gray-500 w-15 h-10  mr-4 cursor-pointer">
            임시 저장
          </button>
        </header>
      )}
    </Container>
  );
};

export default ProductHeader;
