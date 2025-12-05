import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { CircleUserRound, Mail } from "lucide-react";
import { getReviewByIdApi } from "@/common/api/review.api";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Container from "@/components/Container";
import { Angry, Annoyed, Meh, Smile, Laugh } from "lucide-react";

const ratingOptions = [
  { rating: 5, label: "최고예요", icon: <Laugh className="w-6 h-6" /> },
  { rating: 4, label: "좋아요", icon: <Smile className="w-6 h-6" /> },
  {
    rating: 3,
    label: "보통이에요",
    icon: <Meh className="w-6 h-6" />,
  },
  { rating: 2, label: "별로예요", icon: <Annoyed className="w-6 h-6" /> },
  {
    rating: 1,
    label: "정말 별로예요",
    icon: <Angry className="w-6 h-6" />,
  },
];

const ReviewDetailPage = () => {
  const location = useLocation();
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const preloaded = location.state;
  // const { tradeInfo, ratingLabel, content } = location.state || {};
  const [review, setReview] = useState(
    preloaded ?? {
      productTitle: "",
      opponentNickname: "",
      content: "",
      rating: null,
    }
  );

  useEffect(() => {
    const getReviewById = async () => {
      try {
        // console.log("getReviewById!!");
        const data = await getReviewByIdApi(reviewId);
        console.log(data);

        setReview(data);
      } catch (error) {
        console.log(error.code);
        console.log(error.message);

        navigate(-1);
      }
    };

    if (!preloaded) getReviewById();
  }, []);

  return (
    <Container>
      <div className="flex flex-col items-center gap-6">
        {/* 상단 정보 */}
        <div className="flex flex-col items-center">
          {/* 프로필 & 상품 이미지 */}
          <div className="relative w-20 h-20 mb-15">
            <div className="w-full h-full rounded-full overflow-hidden">
              {review.opponentProfileImage ? (
                <img
                  src={review.opponentProfileImage}
                  alt="프로필 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <CircleUserRound className="w-full h-full text-gray-700" />
              )}
            </div>
            <div className="absolute top-12 left-12 z-10 w-16 h-16 rounded-full overflow-hidden">
              {review.productImage ? (
                <img
                  src={review.productImage}
                  alt="상품 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Mail className="w-full h-full text-gray-700" />
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-1 w-50 truncate text-center">
            {review.productTitle}
          </p>
          <p className="text-gray-700 mb-1">
            {review.opponentNickname}님과 거래한 후기 내용입니다
          </p>
        </div>

        {/* 후기 */}
        <div className="bg-brand-ivory p-4 rounded-md w-full max-w-md space-y-3">
          <p className="font-semibold">
            {ratingOptions.find((r) => r.rating === review?.rating)?.label ??
              "후기 평점 정보 없음"}
          </p>
          <p>{review.content}</p>
          <p className="text-sm text-gray-600">
            {dayjs(review.createdAt).format("YYYY년 MM월 DD일 A hh:mm")}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default ReviewDetailPage;
