import Container from "@/components/Container";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

// ⭐ dayjs 추가
import dayjs from "dayjs";

const MyWishListPage = () => {
  const tabs = [
    { key: "product", label: "상품" },
    { key: "seller", label: "셀러 샵" },
  ];

  const active = "product";

  const [wishItems, setWishItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ⭐ axios → fetch 버전
  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products/wishlist",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("서버 응답 오류: " + response.status);
        }

        const data = await response.json();
        console.log("🔥 찜 목록 응답:", data);
        setWishItems(data);
      } catch (err) {
        console.error("찜 목록 불러오기 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, []);

  if (loading) return <Container>불러오는 중...</Container>;
  if (error) return <Container>에러 발생: {error.message}</Container>;

  return (
    <Container>
      {/* 탭 */}
      <div className="flex border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`flex-1 text-center py-2 font-medium ${
              active === t.key ? "" : "bg-white"
            } hover:bg-gray-200 transition-colors`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 날짜 기준 그룹 */}
      {wishItems
        .filter((item) => item !== null) // ⭐ null 값 방지 추가
        .map((item) => (
          <div key={item.productId} className="mt-6">
            {/* ⭐ createdAt → YYYY.MM.DD */}
            <p className="text-sm text-gray-600 mb-2">
              {item.createdAt ? dayjs(item.createdAt).format("YYYY.MM.DD") : ""}
            </p>

            <div className="relative border rounded-xl p-3 flex gap-3 shadow-sm">
              {/* 삭제버튼 */}
              <button className="absolute top-2 right-2">
                <X size={20} className="text-gray-500" />
              </button>

              {/* 이미지 */}
              <div className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt="thumbnail"
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-gray-700 text-sm">사진</span>
                )}
              </div>

              {/* 텍스트 */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="font-semibold text-sm line-clamp-1">
                    {item.productTitle}
                  </p>
                  <p className="font-bold mt-1">
                    {item.sellPrice?.toLocaleString()}원
                  </p>

                  {/* ⭐ createdAt → "X일 전" */}
                  <p className="text-xs text-gray-500 mt-1">
                    {item.createdAt ? dayjs(item.createdAt).fromNow() : ""}
                  </p>
                </div>

                {/* 상태 뱃지 */}
                <div className="flex justify-end mt-1">
                  <span className="px-2 py-1 bg-brand-green text-white text-xs rounded-full">
                    {item.salesStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </Container>
  );
};

export default MyWishListPage;
