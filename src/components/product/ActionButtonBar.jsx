import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";
import { useNavigate } from "react-router-dom";
import { chatRoomIdApi } from "@/common/api/chat.api";
import { useAuth } from "@/hooks/AuthContext";
import { ProductHiddenApi, deleteProductApi } from "@/common/api/product.api";
import { useModal } from "@/hooks/useModal";

const ActionButtonBar = ({
  role,
  //onToggleLike,
  onToggleWish,
  wished,
  onSubmit,
  productId,
  isHidden,
  salesStatus,
  onHide,
  onUnhide,
  loading,
}) => {
  const { user, isAuthenticated } = useAuth(); // 로긴상태,사용자정보 가져오기
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast();
  const navigate = useNavigate();
  const { alert, confirm } = useModal();

  //미로긴 사용자 버튼 클릭시 경고메세지
  const handleNotLoggedIn = async () => {
    if (!isAuthenticated) {
      await alert({ description: "로그인 후 이용 가능합니다." });
      navigate("/login");
      return true;
    }
    return false;
  };

  //상품 숨기기
  const requestHide = async () => {
    if (await handleNotLoggedIn()) return;
    if (salesStatus?.name === "RESERVED") {
      await alert({
        description:
          "예약 중인 상품은 숨길 수 없습니다 거래 상태를 확인 후 다시 시도해주세요.",
      });
      return;
    }
    const isConfirmed = await confirm({
      description: "상품을 숨김 처리하시겠습니까?",
    });
    if (!isConfirmed) return;

    try {
      await ProductHiddenApi(productId, true);
      await alert({ description: "상품이 숨김 처리 되었습니다." });
      if (onHide) onHide();
    } catch (error) {
      console.error("숨김 처리 오류", error);
      await alert({ description: "숨김 처리 중 오류가 발생했습니다." });
    }
  };

  //상품 숨기기 해제
  const requestUnhide = async () => {
    if (await handleNotLoggedIn()) return;
    if (!(await confirm({ description: "상품 숨김을 해제하시겠습니까?" }))) {
      console.log("상품 숨김해제가 취소됨");
      return; // 취소누르면return,확인누르면밑으로
    }
    try {
      await ProductHiddenApi(productId, false);
      await alert({ description: "숨김이 해제되었습니다." });
      if (onUnhide) onUnhide();
    } catch (error) {
      console.error("숨김 해제 오류", error);
      await alert({ description: "숨김 해제 중 오류가 발생했습니다." });
    }
  };

  //상품 삭제하기(soft)
  const requestDelete = async () => {
    if (await handleNotLoggedIn()) return;
    if (salesStatus?.name === "RESERVED") {
      await alert({ description: "현재 예약 중인 상품입니다." });
      return;
    }
    if (!(await confirm({ description: "정말로 상품을 삭제하시겠습니까?" })))
      return;
    try {
      await deleteProductApi(productId);
      await alert({ description: "상품이 삭제되었습니다." });
      // window.location.href = "/";
      navigate(-1);
    } catch (error) {
      console.error("상품 삭제 오류:", error);
      await alert({ description: "삭제 중 오류가 발생했습니다." });
    }
  };

  // 찜 목록 추가/삭제 함수
  const handleHeartClick = async () => {
    //if (!handleNotLoggedIn()) return; //로그인 여부 검사해서 미로그인시 리턴(실행중지)
    if (!isAuthenticated) {
      goLogin(); // 로그인 유도 함수
      return;
    }
    if (onToggleWish) {
      const isAdded = await onToggleWish(productId); // ⭐ 토글 결과값 받아오기

      if (isAdded) showLikeAddedToast(); // 찜 추가
      else showLikeRemovedToast(); // 찜 제거
    }
  };

  const handleButtonClick = async (action) => {
    if (await handleNotLoggedIn()) return;

    if (action === "채팅하기") {
      enterChatRoom();
      return;
    }

    let mention = "";

    if (action === "끌어 올리기") {
      if (await confirm({ description: "이 상품을 끌어올리시겠습니까?" })) {
        console.log("끌어 올리기 실행됨");
      }
      return;
    }

    if (mention) {
      if (window.confirm(mention)) {
        console.log(`${action} 실행됨`);
      } else {
        console.log(`${action} 취소됨`);
      }
      return;
    }

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

  // 바로구매 버튼 클릭
  const handleTradeButtonClick = async () => {
    if (await handleNotLoggedIn()) return;
    if (salesStatus?.name === "RESERVED") {
      await alert({ description: "현재 예약 중인 상품입니다." });
      return;
    }
    navigate(`/purchase/${productId}`);
  };

  // // role을 AuthContext에서 받아오기
  // const role = user?.role;
  return (
    <div>
      {/* 1. 찜하트 , 채팅하기 , 바로구매 - 구매자*/}
      {(!user || role === "BUYER") && (
        <div className="flex gap-2 my-0 px-3 pt-7 py-7">
          <div className="py-1 text-brand-green">
            <Heart
              className="size-7 cursor-pointer"
              onClick={handleHeartClick}
              fill={wished ? "red" : "white"} //dto/ProductDetailResponse의 wished(isWished)
              stroke={wished ? "red" : "currentColor"}
            />
          </div>

          <Button
            variant="ivory"
            className="flex-1 py-5 "
            onClick={() => handleButtonClick("채팅하기")}
          >
            채팅하기
          </Button>
          <Button
            variant="green"
            className={`flex-1 py-5 ${
              salesStatus?.name !== "FOR_SALE"
                ? "opacity-100 cursor-not-allowed grayscale "
                : ""
            } `}
            onClick={handleTradeButtonClick}
            disabled={salesStatus?.name !== "FOR_SALE"}
            // onClick={() => handleButtonClick("바로 구매")}
          >
            바로 구매
          </Button>
        </div>
      )}

      {/* 2. 숨기기<>숨기기해제 , 상품수정 , 상품삭제 - 판매자*/}
      {role === "SELLER" && (
        <div className="flex gap-2 px-3 pt-6 py-6">
          {isHidden ? (
            <Button
              onClick={requestUnhide}
              variant="ivory"
              className="flex-1 py-5"
            >
              숨기기 해제
            </Button>
          ) : (
            <Button
              onClick={requestHide}
              variant="ivory"
              className="flex-1 py-5"
            >
              숨기기
            </Button>
          )}

          <Button
            variant="ivory"
            className="flex-1 py-5 "
            onClick={handleEditClick}
          >
            상품수정
          </Button>
          <Button
            variant="green"
            className={`flex-1 py-5 ${
              salesStatus?.name === "RESERVED"
                ? "opacity-100 cursor-not-allowed grayscale "
                : ""
            } `}
            onClick={requestDelete}
            disabled={salesStatus?.name === "RESERVED"}
          >
            상품삭제
          </Button>
        </div>
      )}

      {/* 3. 끌올 , 숨기기 , 상품수정 , 상품삭제 - 판매자(2차)*/}
      {/* {role === "SELLER2" && (
        <div className="flex gap-1 px-3 pt-6 py-6">
          <Button
            variant="ivory"
            className="flex-1 py-5 "
            onClick={() => handleButtonClick("끌어 올리기")}
          >
            끌어 올리기
          </Button>
          {isHidden ? (
            <Button
              onClick={requestUnhide}
              variant="ivory"
              className="flex-1 py-5"
            >
              숨기기 해제
            </Button>
          ) : (
            <Button
              onClick={requestHide}
              variant="ivory"
              className="flex-1 py-5"
            >
              숨기기
            </Button>
          )}
          <Button
            variant="ivory"
            className="flex-1 py-5 "
            onClick={handleEditClick}
          >
            상품수정
          </Button>
          <Button
            variant="green"
            className={`flex-1 py-5 ${
              salesStatus?.name === "RESERVED"
                ? "opacity-100 cursor-not-allowed grayscale "
                : ""
            } `}
            onClick={requestDelete}
            disabled={salesStatus?.name === "RESERVED"}
          >
            상품삭제
          </Button>
        </div>
      )} */}

      {/* 4. 상품등록시 판매하기 버튼*/}
      {role === "WRITER" && (
        <div className="p-3 ">
          <Button
            type="button"
            variant="green"
            className="w-full py-7 pt-7 text-lg mb-3 mt-6"
            onClick={(e) => {
              e.preventDefault();
              onSubmit(e);
            }}
            disabled={loading}
          >
            {loading ? "등록 중.." : "판매하기"}
          </Button>
        </div>
      )}

      {/* 5. 상품수정시 수정완료 버튼*/}
      {role === "EDITOR" && (
        <div className="p-3 ">
          <Button
            variant="green"
            className="w-full py-7 pt-7 text-lg mb-3 mt-6"
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
