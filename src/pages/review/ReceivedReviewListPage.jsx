import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Container from "@/components/Container";
import { getReceivedReviewsByRatingApi } from "@/common/api/review.api";

const ReviewCard = ({ info }) => {
  return (
    <div
      key={info.reviewId}
      className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
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
  const { memberId } = useParams();
  const [params] = useSearchParams();

  const rating = Number(params.get("rating"));
  const ratingLabel =
    rating === 5 ? "이런 점이 최고예요 ;)" : "이런 점이 좋았어요 :)";

  const [list, setList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const data = await getReceivedReviewsByRatingApi(
          memberId,
          rating,
          page,
          10
        );

        setList(data.content);
        setPageInfo({
          pageSize: data.pageSize,
          startPage: data.startPage,
          endPage: data.endPage,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
          totalCount: data.totalCount,
          totalPages: data.totalPages,
        });
        setPage(data.currentPage);
      } catch (err) {
        console.error(err);
      }
    };
    fetchList();
  }, [memberId, rating, page]);

  return (
    <Container>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-700">{ratingLabel}</p>
        <span className="flex items-center gap-1">
          <p className="text-brand-green font-bold text-lg">
            {pageInfo.totalCount ?? 0}
          </p>
          <p>건</p>
        </span>
      </div>

      {pageInfo.totalCount > 0 ? (
        <div>
          <div className="space-y-6">
            {list.map((item) => (
              <ReviewCard info={item} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              className="px-3 py-1 border rounded disabled:opacity-30"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              이전
            </button>

            <span className="text-sm">
              {page} / {pageInfo.totalPages ?? 1}
            </span>

            <button
              className="px-3 py-1 border rounded disabled:opacity-30"
              disabled={page === pageInfo.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              다음
            </button>
          </div>
        </div>
      ) : (
        <div className=" bg-gray-200 rounded-lg text-gray-400 p-6 text-sm">
          아직 받은 후기가 없습니다!
        </div>
      )}
    </Container>
  );
}
