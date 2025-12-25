import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Container from "@/components/Container";
import { getReceivedReviewsByRatingApi } from "@/common/api/review.api";
import { useAuth } from "@/hooks/AuthContext";

const ReviewCard = ({ info, onClick }) => {
  return (
    <div
      key={info.reviewId}
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <p className="font-medium text-sm text-gray-400">{info.writerNickname}</p>
      <p className="text-gray-700 mt-2 font-medium">{info.content}</p>
      <p className="text-gray-500 text-sm mt-2">
        {new Date(info.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default function ReceivedReviewListPage() {
  const navigate = useNavigate();

  const { sellerId } = useParams();

  const [params] = useSearchParams();
  const rating = Number(params.get("rating"));

  const ratingLabel =
    rating === 5 ? "이런 점이 최고예요 ;)" : "이런 점이 좋았어요 :)";

  const { isAuthenticated, user: currentUser } = useAuth();

  const isMyPage =
    isAuthenticated && currentUser && String(currentUser.memberId) === sellerId;

  const [list, setList] = useState([]);
  const [cursor, setCursor] = useState({
    cursorProductId: null,
    cursorCreatedAt: null,
  });
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const loadMoreRef = useRef(null);

  const fetchList = async () => {
    if (!hasNext || loading) return;
    setLoading(true);

    try {
      const payload = {
        rating,
        cursorCreatedAt: cursor.cursorCreatedAt,
        cursorReviewId: cursor.cursorReviewId,
      };
      if (!isMyPage) {
        payload.memberId = sellerId;
      }

      const data = await getReceivedReviewsByRatingApi(payload);

      setList((prev) => [...prev, ...(data.reviewList || [])]);

      // '총 개수 미표시와 더보기 호출 오류' 관련
      // const nextCount = Number.isFinite(data?.totalCount)
      //   ? Number(data.totalCount)
      //   : data.reviewList?.length || 0;
      // setTotalCount((prev) =>
      //   Number.isFinite(data?.totalCount) ? nextCount : prev + nextCount
      // );

      setHasNext(Boolean(data.hasNext));
      setCursor({
        cursorReviewId: data.cursorReviewId ?? null,
        cursorCreatedAt: data.cursorCreatedAt ?? null,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // rating 변경 시 초기화
    setList([]);
    setCursor({ cursorReviewId: null, cursorCreatedAt: null });
    setHasNext(true);
    setTotalCount(0);
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rating]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchList();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNext, loading]);

  const onCardClick = (reviewId) => {
    navigate(`/reviews/${reviewId}`);
  };

  return (
    <Container>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700">{ratingLabel}</p>
        <span className="flex items-center gap-1">
          <p className="text-brand-green font-bold text-lg">
            {Number.isFinite(totalCount) && totalCount > 0
              ? totalCount
              : list.length}
          </p>
          <p>개</p>
        </span>
      </div>

      {!loading && list.length > 0 ? (
        <div>
          <div className="space-y-6">
            {list.map((item) => (
              <ReviewCard
                key={item.reviewId}
                info={item}
                onClick={() => onCardClick(item.reviewId)}
              />
            ))}
          </div>

          {loading && (
            <p className="text-center mt-10 text-gray-600 text-sm">로딩중...</p>
          )}

          {!hasNext && (
            <p className="text-center mt-10 text-gray-600 text-sm">
              더 이상 후기가 없습니다.
            </p>
          )}

          <div ref={loadMoreRef} style={{ height: "10px" }} />
        </div>
      ) : (
        <div className=" bg-gray-200 rounded-lg text-gray-400 p-6 text-sm">
          후기가 아직 없습니다!
        </div>
      )}
    </Container>
  );
}
