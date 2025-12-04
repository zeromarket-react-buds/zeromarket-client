import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/Container";
import { getReceivedReviewsByRatingApi } from "@/common/api/review.api";

export default function ReceivedReviewListPage() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [params] = useSearchParams();

  const rating = Number(params.get("rating"));
  const ratingLabel =
    rating === 5 ? "이런 점이 최고예요" : "이런 점이 좋았어요";

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
        console.log(data);

        const {
          content,
          currentPage,
          startPage,
          endPage,
          hasNext,
          hasPrevious,
          pageSize,
          totalCount,
          totalPages,
        } = data;

        setList(content);
        setPageInfo({
          pageSize,
          startPage,
          endPage,
          hasNext,
          hasPrevious,
          totalCount,
          totalPages,
        });
        setPage(currentPage);
      } catch (err) {
        console.error(err);
      }
    };
    fetchList();
  }, [memberId, rating, page]);

  return (
    <div className="p-5">
      {/* Header */}

      <div className="flex justify-between items-center">
        <p className="text-gray-700 mb-4">{rating}점 후기</p>
        <p>{pageInfo.totalItems ?? 0}개</p>
      </div>

      <div className="space-y-3">
        {list.map((item) => (
          <div
            key={item.reviewId}
            className="bg-gray-100 p-4 rounded-lg cursor-pointer"
          >
            <p className="font-medium text-sm">
              {item.writerNickname}님과의 거래
            </p>
            <p className="text-gray-700 text-sm mt-1 line-clamp-2">
              {item.content}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
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
  );
}
