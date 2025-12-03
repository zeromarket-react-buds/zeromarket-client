import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import Container from "@/components/Container";
import { getTradeInfoForReviewApi } from "@/common/api/trade.api";
import { createReviewApi } from "@/common/api/review.api";
import { ApiError } from "@/common/error";
import { useAuth } from "@/hooks/AuthContext";

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

const ReviewCreatePage = () => {
  const navigate = useNavigate();
  const { tradeId } = useParams();

  const [tradeInfo, setTradeInfo] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    const getTradeInfo = async () => {
      try {
        // TODO: 유저가 거래 참여자인지 서버에서 확인해주기
        const data = await getTradeInfoForReviewApi(tradeId);

        setTradeInfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    getTradeInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRating || !content.trim()) {
      alert("평가와 내용을 입력해주세요.");
      return;
    }
    try {
      const reviewId = await createReviewApi({
        content,
        rating: selectedRating,
        tradeId,
      });

      navigate(`/reviews/${reviewId}`, {
        state: {
          productTitle: tradeInfo.productTitle,
          opponentNickname: tradeInfo.opponentNickname,
          rating: selectedRating,
          content,
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(error.code);
        alert(error.message);
      }

      navigate(-1);
    }
  };

  return (
    <Container>
      <div className="flex flex-col gap-8">
        {/* 거래 정보 */}
        <div className="flex gap-6 pb-6 border-b">
          <img
            src={tradeInfo.productImageUrl}
            alt=""
            className="w-25 h-25 rounded"
          />
          <div className="flex flex-col gap-2 justify-center">
            <div className="text-sm">{tradeInfo.productTitle}</div>
            <div className="font-semibold">{tradeInfo.opponentNickname}</div>
          </div>
        </div>

        <p className="font-semibold mb-2">
          {tradeInfo.opponentNickname}님과 거래는 어떠셨나요?
        </p>

        {/* Rating */}
        <div className="flex justify-between mb-5">
          {ratingOptions.map((item) => (
            <button
              key={item.rating}
              onClick={() => setSelectedRating(item.rating)}
              className="flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 border rounded-full flex items-center justify-center
                ${
                  selectedRating === item.rating
                    ? "bg-green-100 border-green-600"
                    : "border-gray-400"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>

        {/* content */}
        <div>
          <p className="text-sm pb-2">생생한 후기를 남기고 공유해보세요 :)</p>
          <textarea
            className="w-full h-32 border rounded-md p-3 mb-5 outline-none focus:border-green-600"
            placeholder="후기 내용을 입력해주세요"
            maxLength={200}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="text-right text-sm text-gray-500">
            {content.length} / 200
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          className="mt-auto bg-green-700 text-white py-3 rounded-md font-semibold cursor-pointer"
        >
          후기 등록
        </button>
      </div>
    </Container>
  );
};

export default ReviewCreatePage;
