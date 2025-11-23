import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";

const DetailStickyFooter = () => {
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

  // //   토스트 알림
  // const handleLikeClick = () => {
  //   toast.success("찜 목록에 추가되었어요!", {
  //     position: "bottom-center",
  //     autoClose: 3000,
  //     hideProgressBar: true,
  //     pauseOnHover: false,
  //   });
  // };
  return (
    <div>
      {/* 1. 찜하트 , 채팅하기 , 바로구매 - 구매자*/}
      {/* {role === "BUYER" && ( */}
      <div className="flex gap-2 mt-5 border px-3 py-3">
        <div className="py-1 text-[#1B6439]">
          <Heart className="size-7" onClick={showLikeToast} />
        </div>

        <Button
          className="flex-1 border border-[#1B6439] font-bold bg-[#FAF3E5]  text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("채팅하기")}
        >
          채팅하기
        </Button>
        <Button
          className="flex-1 font-bold bg-[#1B6439] text-[#FAF3E5]  py-2 "
          onClick={() => handleButtonClick("바로 구매")}
        >
          바로 구매
        </Button>
      </div>
      {/* )} */}

      {/* 2. 숨기기<>tna , 상품수정 , 상품삭제 - 판매자*/}
      <div className="flex gap-2 mt-5 border px-3 py-3">
        <Button
          className="flex-1 border font-bold bg-[#FAF3E5] border-[#1B6439] text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("숨기기")}
        >
          숨기기
        </Button>
        <Button
          className="flex-1 border font-bold bg-[#FAF3E5] border-[#1B6439] text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("상품수정")}
        >
          상품수정
        </Button>
        <Button
          className="flex-1 font-bold bg-[#1B6439] text-[#FAF3E5]  py-2 "
          onClick={() => handleButtonClick("상품삭제")}
        >
          상품삭제
        </Button>
      </div>

      {/* 3. 끌올 , 숨기기 , 상품수정 , 상품삭제 -판매자(2차)*/}
      <div className="flex gap-1 mt-5 border px-3 py-3">
        <Button
          className="flex-1 border font-bold bg-[#FAF3E5] border-[#1B6439] text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("끌어 올리기")}
        >
          끌어 올리기
        </Button>
        <Button
          className="flex-1 border font-bold bg-[#FAF3E5] border-[#1B6439] text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("숨기기")}
        >
          숨기기
        </Button>
        <Button
          className="flex-1 border font-bold bg-[#FAF3E5] border-[#1B6439] text-[#1B6439] py-2 "
          onClick={() => handleButtonClick("상품수정")}
        >
          상품수정
        </Button>
        <Button
          className="flex-1 font-bold bg-[#1B6439] text-[#FAF3E5]  py-2 "
          onClick={() => handleButtonClick("상품삭제")}
        >
          상품삭제
        </Button>
      </div>
    </div>
  );
};

export default DetailStickyFooter;
