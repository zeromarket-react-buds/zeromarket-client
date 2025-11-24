import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";

const ProductFooter = ({ role }) => {
  const { showLikeToast } = useLikeToast();

  const handleButtonClick = (action) => {
    let confirmation = false;
    if (action === "끌어 올리기") {
      confirmation = window.confirm("이 상품을 끌어올리시겠습니까?");
    } else if (action === "상품삭제") {
      confirmation = window.confirm("정말로 상품을 삭제하시겠습니까?");
    }
    if (confirmation) {
      console.log(`${action} 버튼 클릭됨!`);
    } else if (action === "끌어 올리기" || action === "상품삭제") {
      console.log(`${action} 취소됨`);
    } else {
      console.log(`${action} 버튼 클릭됨!`);
    }
  };

  return (
    <div>
      {/* 1. 찜하트 , 채팅하기 , 바로구매 - 구매자*/}
      {role === "BUYER" && (
        <div className="flex gap-2 mt-5 border p-3">
          <div className="py-1 text-brand-green">
            <Heart className="size-7" onClick={showLikeToast} />
          </div>

          <Button
            className="flex-1 border border-brand-green font-bold bg-brand-ivory  text-brand-green py-2 "
            onClick={() => handleButtonClick("채팅하기")}
          >
            채팅하기
          </Button>
          <Button
            className="flex-1 font-bold bg-brand-green text-brand-ivory  py-2 "
            onClick={() => handleButtonClick("바로 구매")}
          >
            바로 구매
          </Button>
        </div>
      )}

      {/* 2. 숨기기<>숨기기해제 , 상품수정 , 상품삭제 - 판매자*/}
      {role === "SELLER" && (
        <div className="flex gap-2 mt-5 border p-3">
          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={() => handleButtonClick("숨기기")}
          >
            숨기기
          </Button>
          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={() => handleButtonClick("상품수정")}
          >
            상품수정
          </Button>
          <Button
            className="flex-1 font-bold bg-brand-green text-brand-ivory  py-2 "
            onClick={() => handleButtonClick("상품삭제")}
          >
            상품삭제
          </Button>
        </div>
      )}

      {/* 3. 끌올 , 숨기기 , 상품수정 , 상품삭제 -판매자(2차)*/}
      {role === "SELLER2" && (
        <div className="flex gap-1 mt-5 border p-3">
          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={() => handleButtonClick("끌어 올리기")}
          >
            끌어 올리기
          </Button>
          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={() => handleButtonClick("숨기기")}
          >
            숨기기
          </Button>
          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={() => handleButtonClick("상품수정")}
          >
            상품수정
          </Button>
          <Button
            className="flex-1 font-bold bg-brand-green text-brand-ivory  py-2 "
            onClick={() => handleButtonClick("상품삭제")}
          >
            상품삭제
          </Button>
        </div>
      )}

      {/* 4. 상품등록-판매하기 버튼*/}
      {role === "WRITER" && (
        <div className="mt-5 border p-3">
          <Button
            className="w-full bg-brand-green text-white py-7 text-lg rounded-lg mt-3"
            onClick={() => handleButtonClick("판매하기")}
          >
            판매하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFooter;
