import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import Container from "@/components/Container";
import { getTradeInfoForReviewApi } from "@/common/api/trade.api";
import { createReviewApi } from "@/common/api/review.api";

const ReviewCreatePage = () => {
  const navigate = useNavigate();
  const { tradeId } = useParams();

  const [tradeInfo, setTradeInfo] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [content, setContent] = useState("");

  const ratingOptions = [
    { ranting: 5, label: "최고예요", icon: <ThumbsUp className="w-6 h-6" /> },
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

  useEffect(() => {
    const fetchTradeInfo = async () => {
      try {
        const data = await getTradeInfoForReviewApi(tradeId);
        // console.log(data);
        setTradeInfo(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTradeInfo();
  }, []);

  const handleSubmit = async () => {
    if (!selectedRating || !content.trim()) {
      alert("평가와 내용을 입력해주세요.");
      return;
    }

    // console.log(selectedRating);
    // console.log(content);

    const data = await createReviewApi({ content, selectedRating });

    // navigate(`/reviews/complete/${fakeSavedReviewId}`, {
    //   state: {
    //     ratingLabel: ratingOptions.find((r) => r.key === selected).label,
    //     content,
    //   },
    // });
  };

  return (
    <Container>
      <div className="min-h-screen bg-white p-5 flex flex-col">
        {/* 거래 정보 */}
        <div className="flex gap-6 bg-green-200">
          <img
            src={tradeInfo.productImageUrl}
            alt=""
            className="w-20 h-20 rounded"
          />
          <div>
            <div>{tradeInfo.productTitle}</div>
            <div>{tradeInfo.opponentNickname}</div>
          </div>
        </div>

        <p className="font-semibold mb-2">
          {tradeInfo.opponentNickname}님과 거래는 어떠셨나요?
        </p>

        {/* Rating */}
        <div className="flex justify-between mb-5">
          {ratingOptions.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedRating(item.rating)}
              className="flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 border rounded-full flex items-center justify-center
                ${
                  selectedRating === item.key
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

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          className="mt-auto bg-green-700 text-white py-3 rounded-md font-semibold"
        >
          후기 등록
        </button>
      </div>
    </Container>
  );
};

export default ReviewCreatePage;
