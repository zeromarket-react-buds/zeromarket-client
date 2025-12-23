import Container from "@/components/Container";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

// dayjs 추가
import dayjs from "dayjs";

// 상세 페이지 이동용
import { useNavigate, useLocation, Link } from "react-router-dom";

import { apiClient } from "@/common/client";
import { useAuth } from "@/hooks/AuthContext";

import { useLikeToast } from "@/components/GlobalToast";

const MyWishListPage = () => {
  //fetch → apiClient로 바꾸기
  ///api/products/wishlist 는 로그인 유저 기준으로 동작하는 API
  //ㄴ>WishRestController.java
  const { isAuthenticated } = useAuth();
  console.log(" MyWishListPage 렌더됨");

  const navigate = useNavigate();
  const location = useLocation(); // 페이지 이동 감지

  const active = "product";

  const [wishItems, setWishItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showLikeRemovedToast } = useLikeToast(); //글로벌토스트에서 찜삭제 메시지 함수 가져오기. handleDelete블록 안에 넣어도 됨

  //  찜 삭제(X 버튼)
  const handleDelete = async (productId) => {
    const ok = window.confirm("삭제하시겠습니까?");
    if (!ok) return;
    // try {
    //   const res = await fetch(
    //     `http://localhost:8080/api/products/${productId}/wish`,
    //     {
    //       method: "DELETE",
    //     }
    //   );

    //   if (!res.ok) throw new Error("삭제 실패");
    try {
      await apiClient(`/api/products/${productId}/wish`, {
        method: "DELETE",
      });

      //  삭제 후 프론트에서 즉시 제거
      setWishItems((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      showLikeRemovedToast(); //글로벌토스트에서 가져온 삭제메시지 함수
    } catch (err) {
      console.error("찜 삭제 오류:", err);
    }
  };

  //  찜 목록 로딩
  const fetchWishList = async () => {
    try {
      console.log(" fetchWishList 함수 실행됨");

      const { data } = await apiClient("/api/products/wishlist", {
        method: "GET",
      });

      // const data = await response.json();
      console.log("찜 목록 응답:", data);
      setWishItems(data);
    } catch (err) {
      console.error("찜 목록 불러오기 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 페이지에 들어올 때마다 찜 목록 새로고침
  // useEffect(() => {

  //  로그인 유저만 목록 호출
  useEffect(() => {
    console.log(" 찜 목록 요청 시작됨");

    if (!isAuthenticated) {
      console.log(" 비로그인 → 찜 목록 비움");
      setWishItems([]);
      setLoading(false);
      return;
    }

    fetchWishList();
  }, [location.pathname, isAuthenticated]);

  if (loading) return <Container>불러오는 중...</Container>;
  if (error) return <Container>에러 발생: {error.message}</Container>;
  return (
    <Container>
      {/* 탭 영역 */}
      {/* 상품 찜 (현재 페이지) */}
      <div className="flex border-b">
        <button
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            location.pathname === "/me/wishlist"
              ? "border-brand-green text-brand-green"
              : "border-transparent text-gray-400"
          }`}
          disabled
        >
          상품
        </button>

        {/* 셀러 찜 → 전용 페이지로 이동 */}
        <Link
          to="/me/wishlist/sellers"
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            location.pathname === "/me/wishlist/sellers"
              ? "" //안넣어도 셀러찜 페이지 설정에서 적용됨
              : "border-transparent text-gray-400"
          }`}
        >
          셀러 샵
        </Link>
      </div>

      {/* 날짜 기준 그룹 */}
      {wishItems
        .filter((item) => item !== null)
        .map((item) => (
          <div
            key={item.productId}
            className="mt-6 cursor-pointer"
            //  클릭하면 상세페이지로 이동
            onClick={() => navigate(`/products/${item.productId}`)}
          >
            {/*  찜한 날짜 YYYY.MM.DD (박스 밖) */}
            <p className="text-sm text-gray-600 mb-2">
              {item.wishCreatedAt
                ? dayjs(item.wishCreatedAt).format("YYYY.MM.DD")
                : ""}
            </p>

            <div className="relative border rounded-xl p-3 flex gap-3 shadow-sm">
              {/* 삭제버튼 */}
              <button
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation(); // 상세페이지로 이동 막기(이벤트 버블링 방지)
                  handleDelete(item.productId);
                }}
              >
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

                  {/* 거래정보 + 상품등록일 한 줄로 표시 (수정됨) */}
                  <p className="text-xs text-gray-700 mt-1">
                    {item.tradeTypeDisplay}
                    {item.productCreatedAt && (
                      <> · {dayjs(item.productCreatedAt).fromNow()}</>
                    )}
                  </p>
                </div>

                {/* 판매 상태 뱃지 */}
                <div className="flex justify-end mt-1">
                  <span className="px-2 py-1 bg-brand-green text-white text-xs rounded-full">
                    {item.salesStatusKr ?? item.salesStatus}
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
