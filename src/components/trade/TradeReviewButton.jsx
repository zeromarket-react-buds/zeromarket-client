import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TradeReviewButton = ({ tradeId, reviewStatus }) => {
  console.log("TradeReviewButton reviewStatus =", reviewStatus);
  const navigate = useNavigate();

  if (!reviewStatus) return null;

  const hasMy = !!reviewStatus.myReviewExists;
  const hasPartner = !!reviewStatus.partnerReviewExists;
  const canWrite = !!reviewStatus.canWriteReview;

  const myReviewId = reviewStatus.myReviewId;
  const partnerReviewId = reviewStatus.partnerReviewId;

  // 후기 작성 페이지 이동
  const goWriteReview = (e) => {
    e.stopPropagation();
    navigate(`/trades/${tradeId}/review`);
  };

  // 내가 쓴 후기 상세 이동
  const goMyReviewDetail = (e) => {
    e.stopPropagation();
    if (!myReviewId) return;
    navigate(`/reviews/${myReviewId}`);
  };

  // 받은 후기 상세 이동
  const goReceivedReviewDetail = (e) => {
    e.stopPropagation();
    if (!partnerReviewId) return;
    navigate(`/reviews/${partnerReviewId}`);
  };

  // 공통 버튼 클래스
  const baseBtnClass = "inline-flex flex-1 justify-center py-5";

  // 나도 안 썼고 상대도 안 쓴 상태
  if (canWrite && !hasMy && !hasPartner) {
    return (
      <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
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
