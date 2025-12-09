import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Container from "@/components/Container";
import { getReceivedReviewsByRatingApi } from "@/common/api/review.api";
import { useAuth } from "@/hooks/AuthContext";
// import { getReviewsByRatingApi } from "@/common/api/sellerShop.api";

const ReviewCard = ({ info, onClick }) => {
  return (
    <div
      key={info.reviewId}
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <p className="font-medium text-sm text-gray-400">
        {info.writerNickname}님이 남겨주신 후기입니다
      </p>
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
  const loadMoreRef = useRef(null);

  const fetchList = async () => {
    if (!hasNext || loading) return;
    setLoading(true);

    let data;
    try {
      if (isMyPage) {
        data = await getReceivedReviewsByRatingApi({
          rating,
          cursorCreatedAt: cursor.cursorCreatedAt,
          cursorReviewId: cursor.cursorReviewId,
        });
      } else {
        data = await getReceivedReviewsByRatingApi({
          memberId: sellerId,
          rating,
          cursorCreatedAt: cursor.cursorCreatedAt,
          cursorReviewId: cursor.cursorReviewId,
        });
      }

      setList(data.reviewList);
      setHasNext(data.hasNext);
      setCursor({
        cursorReviewId: data.cursorReviewId,
        cursorCreatedAt: data.cursorCreatedAt,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 새로고침 & 화면 이동 시 reset
    setList([]);
    setCursor({ cursorReviewId: null, cursorCreatedAt: null });
    setHasNext(true);

    fetchList();
  }, [rating]);

  // 판매상품 목록 조회 - 페이지네이션(커서 기반)
  useEffect(() => {
    // 1. loadMoreRef가 없으면 실해 안 함
    if (!loadMoreRef.current) return;

    // 2. IntersectionObserver 생성 (특정 요소가 화면(viewport)에 보이는지 감지하는 브라우저 API)
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0]: 관찰 중인 요소의 정보

        if (
          entries[0].isIntersecting && // 요소가 화면에 보이고
          hasNext && // 다음 페이지가 있고
          !loading // 로딩 중이 아니면
        ) {
          fetchProductsBySeller(); // 데이터 fetch!
        }
      },
      { threshold: 1.0 }
    );

    // 3. loadMoreRef 요소 관찰 시작
    observer.observe(loadMoreRef.current);

    // 3. cleanup: 컴포넌트 언마운트 시 관찰 중지
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
            {/* {pageInfo.totalCount ?? 0} */}
          </p>
          <p>건</p>
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

          {/* 다음 로딩 중 */}
          {loading && (
            <p className="text-center mt-10 text-gray-600 text-sm">로딩중...</p>
          )}

          {/* 데이터 끝 */}
          {!hasNext && (
            <p className="text-center mt-10 text-gray-600 text-sm">
              마지막입니다.
            </p>
          )}

          {/* 무한 스크롤 적용 - loadMoreRef */}
          <div ref={loadMoreRef} style={{ height: "10px" }} />
        </div>
      ) : (
        <div className=" bg-gray-200 rounded-lg text-gray-400 p-6 text-sm">
          아직 받은 후기가 없습니다!
        </div>
      )}
    </Container>
  );
}
