import Container from "@/components/Container";
import { UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLikeToast } from "@/components/GlobalToast";

// 페이지 이동용
import { useNavigate, useLocation, Link } from "react-router-dom";

import { apiClient } from "@/common/client";
import { useAuth } from "@/hooks/AuthContext";
import { useModal } from "@/hooks/useModal";

const MyWishSellerListPage = () => {
  /// api/wish/sellers 는 로그인 유저 기준으로 동작
  const { isAuthenticated } = useAuth();
  console.log(" MyWishSellerListPage (셀러 찜) 렌더됨");

  const navigate = useNavigate();
  const location = useLocation();

  const [sellerItems, setSellerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showLikeRemovedToast } = useLikeToast(); //글로벌토스트에서 찜삭제 메시지 함수 가져오기
  const { alert, confirm } = useModal();
  // 셀러 찜 삭제
  const handleDelete = async (sellerId) => {
    const ok = await confirm({ description: "삭제하시겠습니까?" });
    if (!ok) return;

    try {
      //셀러 찜은 토글 API 재사용
      await apiClient(`/api/sellershop/${sellerId}/like`, {
        method: "POST",
      });

      // 삭제 후 즉시 제거
      setSellerItems((prev) =>
        prev.filter((item) => item.sellerId !== sellerId)
      );

      showLikeRemovedToast(); //글로벌토스트에서 가져온 삭제메시지 함수
    } catch (err) {
      console.error("셀러 찜 삭제 오류:", err);
    }
  };

  // 셀러 찜 목록 조회
  const fetchWishSellerList = async () => {
    try {
      console.log("fetchWishSellerList 실행됨");

      const { data } = await apiClient("/api/me/wishlist/sellers", {
        method: "GET",
      });

      console.log("셀러 찜 목록 응답:", data);
      setSellerItems(data);
    } catch (err) {
      console.error("셀러 찜 목록 불러오기 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 로그인 유저만 조회
  useEffect(() => {
    console.log("셀러 찜 목록 요청 시작");

    if (!isAuthenticated) {
      console.log(" 비로그인 → 셀러 찜 목록 비움");
      setSellerItems([]);
      setLoading(false);
      return;
    }

    fetchWishSellerList();
  }, [location.pathname, isAuthenticated]);

  if (loading) return <Container>불러오는 중...</Container>;
  if (error) return <Container>에러 발생: {error.message}</Container>;

  return (
    <Container>
      {/* ======================= */}
      {/* 탭 영역 */}
      {/* ======================= */}
      <div className="flex border-b">
        {/* 상품 찜 */}
        <Link
          to="/me/wishlist"
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            location.pathname === "/me/wishlist"
              ? "" //안넣어도 상품찜 페이지 설정에서 적용됨
              : "border-transparent text-gray-400"
          }`}
        >
          상품
        </Link>

        {/* 셀러 찜 (현재 페이지) */}
        <button
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            location.pathname === "/me/wishlist/sellers"
              ? "border-brand-green text-brand-green"
              : "border-transparent text-gray-400"
          }`}
          disabled
        >
          셀러 샵
        </button>
      </div>

      {/* ======================= */}
      {/* 셀러 찜 목록 */}
      {/* ======================= */}
      {sellerItems
        .filter((item) => item !== null)
        .map((item) => (
          <div
            key={item.sellerId}
            className="mt-6 cursor-pointer"
            onClick={() => navigate(`/sellershop/${item.sellerId}`)}
          >
            {/* 셀러 카드 css*/}
            <div className="relative border rounded-xl p-3 flex gap-3 shadow-sm">
              {/* 삭제 버튼 */}
              <button
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation(); // 이동 방지
                  handleDelete(item.sellerId);
                }}
              >
                <X size={20} className="text-gray-500" />
              </button>

              {/* 프로필 이미지 */}
              <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                {/* profileImage 필드명 */}
                {item.profileImage ? (
                  <img
                    src={item.profileImage}
                    alt={`${item.nickname} 프로필 이미지`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="text-gray-400 w-7 h-7" />
                )}
              </div>

              {/* 셀러 정보 */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  {/* nickname 필드명 */}
                  <p className="font-semibold text-sm text-gray-800">
                    {item.nickname}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </Container>
  );
};

export default MyWishSellerListPage;
