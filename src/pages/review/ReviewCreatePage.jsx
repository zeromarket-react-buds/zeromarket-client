// /reviews/write

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import Container from "@/components/Container";

const ReviewWrite = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState("");

  const ratingOptions = [
    { key: "best", label: "최고예요", icon: <ThumbsUp className="w-6 h-6" /> },
    { key: "good", label: "좋아요", icon: <ThumbsUp className="w-6 h-6" /> },
    {
      key: "normal",
      label: "보통이에요",
      icon: <ThumbsDown className="w-6 h-6" />,
    },
    { key: "bad", label: "별로예요", icon: <ThumbsDown className="w-6 h-6" /> },
    {
      key: "verybad",
      label: "정말 별로예요",
      icon: <ThumbsDown className="w-6 h-6" />,
    },
  ];

  const handleSubmit = async () => {
    if (!selected || !content.trim()) {
      alert("평가와 내용을 입력해주세요.");
      return;
    }

    // 예시로 작성했지만, 실제 API 호출 부분
    const fakeSavedReviewId = 123; // 서버에서 생성된 reviewId

    // 실제 예시 (백엔드 연동 시)
    /*
    const res = await api.post("/reviews", {
      productId,
      rating: selected,
      content,
    });
    const reviewId = res.data.reviewId;
    */

    navigate(`/reviews/complete/${fakeSavedReviewId}`, {
      state: {
        ratingLabel: ratingOptions.find((r) => r.key === selected).label,
        content,
      },
    });
  };

  return (
    <Container>
      <div className="min-h-screen bg-white p-5 flex flex-col">
        {/* 거래 정보 */}
        <div className="flex gap-6 bg-green-200">
          <img src="" alt="" className="w-20 h-20 rounded" />
          <div>
            <div>상품명</div>
            <div>거래 상대 닉네임</div>
          </div>
        </div>

        <p className="font-semibold mb-2">거래는 어떠셨나요?</p>

        {/* Rating */}
        <div className="flex justify-between mb-5">
          {ratingOptions.map((item) => (
            <button
              key={item.key}
              onClick={() => setSelected(item.key)}
              className="flex flex-col items-center"
            >
              <div
                className={`w-12 h-12 border rounded-full flex items-center justify-center
                ${
                  selected === item.key
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

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

export default ReviewWrite;
