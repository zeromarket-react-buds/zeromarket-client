import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getReceivedReviewSummaryApi } from "@/common/api/review.api";
import Container from "@/components/Container";

const ratingLabels = {
  5: "이런 점이 좋았어요",
  4: "이런 점이 최고예요",
};

const SectionItem = ({ title, data, memberId }) => {
  const navigate = useNavigate();

  const handleMoreClick = (rating) => {
    navigate(`/reviews/received/${memberId}?rating=${rating}`);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between items-center text-gray-700 mb-3">
        <p className="text-sm">{title}</p>
        <span className="text-green-600 font-semibold">
          {data.totalCount} 건
        </span>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm">
        <ul className="list-disc list-inside text-black space-y-2">
          {data.totalCount > 0 ? (
            data.latestReviews.map((item) => (
              <li key={item.reviewId} className="line-clamp-1">
                {item.content}
              </li>
            ))
          ) : (
            <p className="text-gray-500">아직 받은 리뷰가 없어요!</p>
          )}
        </ul>
      </div>

      <button
        className="w-full mt-3 text-center text-gray-600 text-sm underline cursor-pointer"
        onClick={() => handleMoreClick(data.rating)}
      >
        더 보기
      </button>
    </div>
  );
};

export default function ReceivedReviewSummaryPage() {
  const navigate = useNavigate();
  const { memberId } = useParams();

  const [nickname, setNickname] = useState("");
  const [totalCount, setTotalCount] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({
    // nicknname: "",
    // totalCount: null,
    rating5: {
      totalCount: null,
      rating: null,
      latestReviews: [],
    },
    rating4: {
      totalCount: null,
      rating: null,
      latestReviews: [],
    },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReceivedReviewSummaryApi(memberId);
        console.log(data);

        const { nickname, rating5, rating4 } = data;
        setNickname(nickname);
        setReviewSummary({ rating5, rating4 });
        setTotalCount(rating5.totalCount + rating4.totalCount);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, [memberId]);

  return (
    <Container>
      {/* Summary */}
      <p className="text-gray-700 mb-12 text-center">
        <span className="font-semibold text-brand-green">{nickname}</span>님은
        현재 <span className="font-bold text-brand-green">{totalCount}</span>
        건의 후기를 받았어요
      </p>

      {/* Rating 5 Section */}
      <SectionItem
        title="이런 점이 최고예요"
        data={reviewSummary.rating5}
        memberId={memberId}
      />

      {/* Rating 4 Section */}
      <SectionItem
        title="이런 점이 좋았어요"
        data={reviewSummary.rating4}
        memberId={memberId}
      />

      <p className="text-gray-400 text-sm text-center mt-4">
        후기는 최신순으로 3건만 보입니다
      </p>
    </Container>
  );
}
