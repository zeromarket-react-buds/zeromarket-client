import Container from "@/components/Container";
import { X } from "lucide-react";

const MyWishListPage = () => {
  const tabs = [
    { key: "product", label: "상품" },
    { key: "seller", label: "셀러 샵" },
  ];

  const active = "product";
  //추후 API 연동할곳
  const wishItems = [
    {
      productId: 1,
      productTitle: "실제로 들어갈 상품명",
      sellPrice: 20000,
      salesStatus: { description: "판매중" },
      liked: true,
      thumbnailUrl: "",
      time: "직거래 · 4일 전",
      date: "2025. 10. 27",
    },
    {
      productId: 2,
      productTitle: "또 다른 상품명 예시",
      sellPrice: 15000,
      salesStatus: { description: "예약됨" },
      liked: true,
      thumbnailUrl: "",
      time: "직거래 · 1일 전",
      date: "2025. 10. 27",
    },
  ];

  return (
    <Container>
      {/* 탭 (상품 / 셀러 샵) */}
      <div className="flex border-b">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`
              flex-1 text-center py-2 font-medium
              ${active === t.key ? "" : "bg-white"}
              hover:bg-gray-200 transition-colors
            `}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 날짜 기준 그룹  */}
      {wishItems.map((item) => (
        <div key={item.productId} className="mt-6">
          <p className="text-sm text-gray-600 mb-2">{item.date}</p>

          {/* 찜 상품 카드 UI */}
          <div className="relative border rounded-xl p-3 flex gap-3 shadow-sm">
            {/* 삭제(X) 버튼 */}
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
                  {item.sellPrice.toLocaleString()}원
                </p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
              </div>

              {/* 판매 상태 뱃지 */}
              <div className="flex justify-end mt-1">
                <span className="px-2 py-1 bg-brand-green text-white text-xs rounded-full">
                  {item.salesStatus?.description}
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
