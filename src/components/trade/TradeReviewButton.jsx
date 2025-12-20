import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";

const TradeReviewButton = ({ tradeId, reviewStatus }) => {
  console.log("TradeReviewButton reviewStatus =", reviewStatus);
  const navigate = useNavigate();
  const { alert } = useModal();

  if (!reviewStatus) return null;

  const myReviewId = reviewStatus.myReviewId ?? null;
  const partnerReviewId = reviewStatus.partnerReviewId ?? null;

  // 서버가 내려주는 exists 플래그가 가끔 틀릴 수 있으니, id가 있으면 그걸 우선 신뢰
  const hasMy = Boolean(myReviewId) || Boolean(reviewStatus.myReviewExists);
  const hasPartner =
    Boolean(partnerReviewId) || Boolean(reviewStatus.partnerReviewExists);

  // 내가 이미 쓴 경우에는 canWrite가 true로 오더라도 화면에서는 못 쓰게 막는게 안전
  const canWrite = Boolean(reviewStatus.canWriteReview) && !hasMy;

  // 후기 작성 페이지 이동
  const goWriteReview = (e) => {
    e.stopPropagation();
    navigate(`/trades/${tradeId}/review`);
  };

  // 내가 쓴 후기 상세 이동
  const goMyReviewDetail = async (e) => {
    e.stopPropagation();

    // 기존엔 조용히 return해서 "왜 안되지?"가 됨 → 원인 즉시 보이게 처리
    if (!myReviewId) {
      await alert({
        description:
          "보낸 후기가 존재한다고 표시되었지만, 후기 ID가 비어 있습니다. 상세 이동이 불가능합니다. (서버 응답 reviewStatus.myReviewId 확인 필요)",
      });
      return;
    }

    navigate(`/reviews/${myReviewId}`);
  };

  // 받은 후기 상세 이동
  const goReceivedReviewDetail = async (e) => {
    e.stopPropagation();

    if (!partnerReviewId) {
      await alert({
        description:
          "받은 후기가 존재한다고 표시되었지만, 후기 ID가 비어 있습니다. 상세 이동이 불가능합니다. (서버 응답 reviewStatus.partnerReviewId 확인 필요)",
      });
      return;
    }

    navigate(`/reviews/${partnerReviewId}`);
  };

  // 공통 버튼 클래스
  const baseBtnClass = "inline-flex flex-1 justify-center py-5 mt-4";

  // 나도 안 썼고 상대도 안 쓴 상태
  if (canWrite && !hasMy && !hasPartner) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <Button
          variant="green"
          type="button"
          onClick={goWriteReview}
          className="w-full py-5"
        >
          후기 보내기
        </Button>
      </div>
    );
  }

  // 나는 안 썼고 상대는 쓴 상태
  if (!hasMy && hasPartner) {
    return (
      <div className="flex flex-row w-full gap-2">
        <Button
          variant="green"
          type="button"
          onClick={goWriteReview}
          className={baseBtnClass}
        >
          후기 보내기
        </Button>
        <Button
          variant="ivory"
          type="button"
          onClick={goReceivedReviewDetail}
          className={baseBtnClass}
        >
          받은 후기 보기
        </Button>
      </div>
    );
  }

  // 나는 썼고 상대는 안 쓴 상태
  if (hasMy && !hasPartner) {
    return (
      <div className="flex flex-col gap-2 mt-2">
        <Button
          variant="ivory"
          type="button"
          onClick={goMyReviewDetail}
          className="w-full py-5"
        >
          보낸 후기 보기
        </Button>
      </div>
    );
  }

  // 나도 쓰고 상대도 쓴 상태
  if (hasMy && hasPartner) {
    return (
      <div className="flex flex-row w-full gap-2">
        <Button
          variant="ivory"
          type="button"
          onClick={goMyReviewDetail}
          className={baseBtnClass}
        >
          보낸 후기 보기
        </Button>
        <Button
          variant="ivory"
          type="button"
          onClick={goReceivedReviewDetail}
          className={baseBtnClass}
        >
          받은 후기 보기
        </Button>
      </div>
    );
  }

  return null;
};

export default TradeReviewButton;
