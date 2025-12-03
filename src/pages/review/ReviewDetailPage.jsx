import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { getReviewByIdApi } from "@/common/api/review.api";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Container from "@/components/Container";

const ratingOptions = [
  { rating: 5, label: "최고예요", icon: <ThumbsUp className="w-6 h-6" /> },
  { rating: 4, label: "좋아요", icon: <ThumbsUp className="w-6 h-6" /> },
  {
    rating: 3,
    label: "보통이에요",
    icon: <ThumbsDown className="w-6 h-6" />,
  },
  { rating: 2, label: "별로예요", icon: <ThumbsDown className="w-6 h-6" /> },
  {
    rating: 1,
    label: "정말 별로예요",
    icon: <ThumbsDown className="w-6 h-6" />,
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
        // console.log(data);

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
          <Mail className="w-16 h-16 text-black mb-4" />
          <p className="text-sm text-gray-700 mb-2">{review.productTitle}</p>
          <p className="text-sm text-gray-700">{review.opponentNickname}님과</p>
          <p className="text-sm text-gray-700 mb-1">거래한 후기 내용입니다</p>
        </div>

        {/* 후기 */}
        <div className="bg-gray-100 p-4 rounded-md w-full max-w-md">
          <p className="font-semibold mb-2">
            {ratingOptions.find((r) => r.rating === review?.rating)?.label ??
              "후기 평점 정보 없음"}
          </p>
          <hr className="border-gray-300 mb-2" />
          <p>{review.content}</p>
        </div>
      </div>
    </Container>
  );
};

export default ReviewDetailPage;
