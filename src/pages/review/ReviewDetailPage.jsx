import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { getReviewByIdApi } from "@/common/api/review.api";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

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

  const preloaded = location.state;
  // const { tradeInfo, ratingLabel, content } = location.state || {};
  const [review, setReview] = useState(preloaded);

  useEffect(() => {
    const getReviewById = async () => {
      try {
        console.log("getReviewById!!");
        const data = await getReviewByIdApi(reviewId);
        console.log(data);

        setReview(data);
      } catch (error) {
        console.log(error.code);
        console.log(error.message);
      }
    };

    if (!preloaded) getReviewById();
  }, []);

  return (
    <div className="min-h-screen bg-white p-5 flex flex-col items-center">
      {/* Header */}
      {/* <div className="w-full flex items-center mb-8">
        <ArrowLeft className="w-6 h-6" />
        <p className="flex-1 text-center font-semibold text-lg">
          내가 보낸 후기
        </p>
      </div> */}

      <Mail className="w-16 h-16 text-black mb-4" />

      <p className="text-sm text-gray-700 mb-1">{review.productTitle}</p>
      <p className="text-sm text-gray-700">{review.opponentNickname}님과</p>
      <p className="text-sm text-gray-700 mb-1">거래한 후기 내용입니다</p>
      {/* <p className="text-sm text-gray-700 mb-1">
        {review?.createdAt
          ? dayjs(review.createdAt).format("YYYY년 MM월 DD일 HH:mm")
          : ""}
      </p> */}

      <p className="font-semibold text-base mb-6"></p>

      <div className="bg-gray-100 p-4 rounded-md w-full max-w-md">
        <p className="font-semibold mb-2">
          {ratingOptions.find((r) => r.rating === review?.rating)?.label ??
            "후기 평점 정보 없음"}
        </p>
        <hr className="border-gray-300 mb-2" />
        <p>{review.content}</p>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
