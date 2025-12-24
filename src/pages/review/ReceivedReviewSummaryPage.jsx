import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getReceivedReviewSummaryApi } from "@/common/api/review.api";
import Container from "@/components/Container";

const ratingLabels = {
  5: "이런 점이 좋았어요",
  4: "이런 점이 최고예요",
};

export const SectionItem = ({ title, data, memberId = null }) => {
  const navigate = useNavigate();

  const handleMoreClick = (rating) => {
    if (memberId) {
      navigate(`/sellershop/${memberId}/reviews?rating=${rating}`);
      return;
    }
    navigate(`/me/reviews?rating=${rating}`);
  };

  return (
    <div className="mb-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium text-lg">{title}</p>
        <div className="mr-4">
          <span className="text-brand-green text-2xl font-bold ">
            {data.totalCount}
          </span>
          <span className=" font-semibold ml-1">건</span>
        </div>
      </div>

      <div className="border rounded-3xl p-5 bg-white ">
        {data.totalCount > 0 ? (
          <ul className="list-disc list-outside px-6 space-y-2 ">
            {data.latestReviews.map((item) => (
              <li key={item.reviewId}>
                <span className="line-clamp-1">{item.content}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex justify-center">
            <p className="text-brand-mediumgray ">아직 받은 리뷰가 없어요!</p>
          </div>
        )}
      </div>

      <button
        className="w-full mt-4 text-center text-brand-darkgray hover:underline cursor-pointer"
        onClick={() => handleMoreClick(data.rating)}
      >
        더 보기
      </button>
    </div>
  );
};

export default function ReceivedReviewSummaryPage() {
  const navigate = useNavigate();
  // const { memberId } = useParams();

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
        const data = await getReceivedReviewSummaryApi();
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
  }, []);

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
        title="이런 점이 최고예요!"
        data={reviewSummary.rating5}
        // memberId={memberId}
      />

      {/* Rating 4 Section */}
      <SectionItem
        title="이런 점이 좋았어요"
        data={reviewSummary.rating4}
        // memberId={memberId}
      />

      <p className="text-gray-400 text-sm text-center mt-4">
        후기는 최신순으로 3건만 보입니다
      </p>
    </Container>
  );
}
