import { UserRound, Heart, Pen } from "lucide-react";
import Container from "@/components/Container";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; //건수 증가
import {
  getAverageRatingApi,
  getCountReceivedReviewsOnMyPage,
} from "@/common/api/review.api";
// fetch 쓰면 토큰이 안 붙어서 count가 변하지 않음 → apiClient 사용해야 함
import { apiClient } from "@/common/client";

export default function MyPage() {
  // ⭐ 찜 개수 상태 추가
  const [wishCount, setWishCount] = useState(0);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [trustScore, setTrustScore] = useState(0.0);
  const [receivedReviewCount, setReceivedReviewCount] = useState(0);

  // ⭐ 추가됨: 현재 페이지 정보를 가져옴
  const location = useLocation();

  // ⭐ 찜 개수 불러오기 API
  const fetchWishCount = async () => {
    try {
      // const res = await fetch(
      //   "http://localhost:8080/api/products/wishlist/count"
      // );

      // if (!res.ok) throw new Error("찜 개수 조회 실패");

      // const count = await res.json();
      // setWishCount(count);
      // ⭐ 수정됨: apiClient 사용 → JWT 자동 포함 → userDetails 정상 전달
      const { data } = await apiClient("/api/products/wishlist/count", {
        method: "GET",
      });

      setWishCount(data);
    } catch (err) {
      console.error("🔥 찜 개수 에러:", err);
    }
  };

  const fetchTrustScore = async () => {
    if (loading) {
      return;
    }
    const score = await getAverageRatingApi(user.memberId);
    setTrustScore(score);
  };

  const fetchReceivedReviewCount = async () => {
    if (loading) {
      return;
    }
    const count = await getCountReceivedReviewsOnMyPage(user.memberId);
    setReceivedReviewCount(count);
  };

  // ⭐ 페이지 로드될 때 찜 개수 불러오기
  useEffect(() => {
    if (loading) {
      return;
    }
    fetchWishCount();
    fetchTrustScore();
    fetchReceivedReviewCount();
  }, [location.pathname, loading]);
  //location.pathname,추가 찜 후 MyPage로 다시 올 때마다 갱신됨!

  const handleLogout = () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) {
      return;
    }
    logout();
    alert("로그아웃되었습니다. 홈으로 이동합니다.");
    navigate("/");
  };

  return (
    <Container>
      {/* 프로필 */}
      <section className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center bg-brand-green">
          <UserRound className="text-brand-ivory size-10" />
        </div>
        <div className="text-lg font-semibold">{user?.nickname}</div>
      </section>

      {/* 점수 카드 */}
      <section className="border rounded-2xl p-4 mb-2">
        <div className="flex justify-between mb-2 text-[16px]">
          <span>신뢰점수</span>
          <span className="text-brand-green font-bold text-lg text-[20px]">
            {trustScore.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span>환경점수</span>
          <span className="text-brand-green font-bold text-lg text-[20px]">
            4,000
          </span>
        </div>
      </section>

      <p className="text-sm text-brand-mediumgray text-right mb-6">
        <Link to="/me/envgradeguide">환경점수는 어떻게 사용할 수 있나요?</Link>
      </p>

      {/* 한줄 소개 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">한 줄 소개</h2>
        <div className="border rounded-2xl p-3 text-gray-700">
          {user?.introduction || "한 줄 소개가 비어있어요."}
        </div>
      </section>

      {/* 메뉴 리스트 */}
      <section className="border rounded-2xl p-4 mb-6">
        <ul className="space-y-4 text-gray-800 ">
          <li>
            <Link to="/me/profile">프로필 설정</Link>
          </li>
          <li>
            <Link to="/me/profile-edit">회원 정보 설정</Link>
          </li>
          <li>
            <Link to="/me/selling">판매 내역</Link>
          </li>
          <li>
            <Link to="/me/purchases">구매 내역</Link>
          </li>
          <li>
            <Link to="/me/chats">채팅 목록</Link>
          </li>
          <li>차단 유저 목록</li>
        </ul>
      </section>

      {/* 찜 & 후기 */}
      <section className="border rounded-2xl p-4 flex justify-around ">
        <Link
          to="/me/wishlist"
          className="flex flex-col items-center cursor-pointer"
        >
          <Heart
            color="var(--color-brand-green)"
            size={32}
            className="mx-auto mb-2.5"
          />
          <div className="flex items-center gap-2">
            <span>찜 목록</span>

            {/* ⭐ 여기 수정됨: 하드코딩된 1 → 동적 wishCount */}
            <span className="font-bold text-brand-green">{wishCount}</span>

            <span className="text-black">건</span>
          </div>
        </Link>
        <div className="flex flex-col items-center">
          <Link to={"/me/reviews/summary"}>
            <Pen
              color="var(--color-brand-green)"
              size={32}
              className="mx-auto mb-2.5"
            />
            <div className="flex items-center gap-2">
              <span>받은 후기</span>
              <span className="font-bold text-brand-green">
                {receivedReviewCount}
              </span>
              <span className="text-black">건</span>
            </div>
          </Link>
        </div>
      </section>

      {/*  로그아웃 / 탈퇴 */}
      <section className="border rounded-2xl p-4 mt-6">
        <ul className="space-y-4 text-gray-800">
          <li className="cursor-pointer" onClick={handleLogout}>
            로그아웃
          </li>
          <li className="cursor-pointer">탈퇴</li>
        </ul>
      </section>
    </Container>
  );
}
