import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";
import { useNavigate } from "react-router-dom";
import { chatRoomIdApi } from "@/common/api/chat.api";

const ActionButtonBar = ({
  role,
  onToggleLike,
  isWished,
  onSubmit,
  productId,
  isHidden,
}) => {
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast();
  const navigate = useNavigate();

  //상품 숨기기
  const requestHide = async () => {
    await fetch(`http://localhost:8080/api/products/${productId}/hide`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: true }),
    });
    alert("상품이 숨김 처리 되었습니다.");
    window.location.reload(); //같은 url 그대로 다시 불러오는 새로고침(라우터 개입X,hard refresh)
  };

  //상품 숨기기 해제
  const requestUnhide = async () => {
    await fetch(`http://localhost:8080/api/products/${productId}/hide`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: false }),
    });
    alert("숨김이 해제되었습니다.");
    window.location.reload();
  };

  //상품 삭제하기(soft)
  const requestDelete = async () => {
    const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("삭제 중 오류가 발생했습니다.");
      return;
    }
    alert("상품이 삭제되었습니다.");
    window.location.href = "/"; //url을 변경해(지금 페이지를 벗어나) /로 이동(라우터를 무시,브라우저가 직접 페이지전환)
  };

  // 찜 목록 추가/삭제 함수
  const handleHeartClick = () => {
    if (!isWished) showLikeAddedToast();
    else showLikeRemovedToast();

    if (onToggleLike) {
      onToggleLike();
    }
  };

  const handleButtonClick = (action) => {
    let confirmation = false;

    if (action === "채팅하기") {
      enterChatRoom();
      return;
    }

    if (action === "숨기기") {
      if (window.confirm("상품을 숨기시겠습니까?")) {
        requestHide();
      }
      return;
    }

    if (action === "상품삭제") {
      if (window.confirm("정말로 상품을 삭제하시겠습니까?")) {
        requestDelete();
      }
      return;
    }

    let mention = "";

    if (action === "끌어 올리기") {
      mention = "이 상품을 끌어올리시겠습니까?"; //mention 문자열만 설정, 아래에서 한번에 처리하는 구조
    }

    // confirmation = mention ? window.confirm(mention) : false;

    if (mention) {
      if (window.confirm(mention)) {
        console.log(`${action} 실행됨`);
      } else {
        console.log(`${action} 취소됨`);
      }
      return;
    }

    // if (confirmation) {
    //   console.log(`${action} 버튼 클릭됨!`); //메세지를 세팅만하고,실제 행동은 아래 공통로직에서
    //   return;
    // }
    // if (!confirmation && ["끌어 올리기", "상품삭제"].includes(action)) {
    //   console.log(`${action} 취소됨`);
    //   return;
    // }

    console.log(`${action} 버튼 클릭됨!`);
  };

  const enterChatRoom = async () => {
    // 채팅 있는지 조회 후 있으면 채팅방 번호 리턴. 없으면 생성해서 리턴. 오류나면 예외처리
    const chatRoomId = await chatRoomIdApi(productId);
    console.log(chatRoomId);
    navigate(`/chats/${chatRoomId}`); // :roomId
  };

  // 상품수정
  const handleEditClick = () => {
    if (!productId) {
      console.warn("productId가 없습니다. 수정 페이지로 이동할 수 없습니다.");
      return;
    }
    navigate(`/products/edit/${productId}`);
  };

  return (
    <div>
      {/* 1. 찜하트 , 채팅하기 , 바로구매 - 구매자*/}
      {role === "BUYER" && (
        <div className="flex gap-2 my-0 px-3 pt-7 py-7">
          <div className="py-1 text-brand-green">
            <Heart
              className="size-7 cursor-pointer"
              onClick={handleHeartClick}
            />
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
        <div className="flex gap-2  my-0 px-3 pt-7 py-7">
          {isHidden ? (
            <Button
              onClick={() => {
                if (window.confirm("숨김을 해제하시겠습니까?")) {
                  requestUnhide();
                }
              }}
              className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2"
            >
              숨기기 해제
            </Button>
          ) : (
            <Button
              onClick={() => handleButtonClick("숨기기")}
              className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2"
            >
              숨기기
            </Button>
          )}

          <Button
            className="flex-1 border font-bold bg-brand-ivory border-brand-green text-brand-green py-2 "
            onClick={handleEditClick}
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

      {/* 3. 끌올 , 숨기기 , 상품수정 , 상품삭제 - 판매자(2차)*/}
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
            onClick={handleEditClick}
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

      {/* 4. 상품등록시 판매하기 버튼*/}
      {role === "WRITER" && (
        <div className="p-3 ">
          <Button
            className="w-full bg-brand-green text-white py-7 pt-7 text-lg rounded-lg mb-3 mt-6"
            // onClick={() => handleButtonClick("판매하기")}
            onClick={onSubmit}
          >
            판매하기
          </Button>
        </div>
      )}

      {/* 5. 상품수정시 수정완료 버튼*/}
      {role === "EDITOR" && (
        <div className="p-3 ">
          <Button
            className="w-full bg-brand-green text-white py-7 pt-7 text-lg rounded-lg mb-3 mt-6"
            // onClick={() => handleButtonClick("수정완료")}
            onClick={onSubmit}
          >
            수정 완료
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActionButtonBar;
