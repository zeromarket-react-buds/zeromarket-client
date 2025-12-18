import Container from "@/components/Container";
import { useNavigate, useParams } from "react-router-dom";
import { UserRound, Heart } from "lucide-react";
import ProductCard from "@/components/display/ProductCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { createReportApi } from "@/common/api/report.api";
import ReportModal from "@/components/report/ReportModal";
import { getProductsBySeller } from "@/common/api/sellerShop.api";
import { getReceivedReviewSummaryApi } from "@/common/api/review.api";
import { SectionItem } from "../review/ReceivedReviewSummaryPage";
import { getMemberProfile } from "@/common/api/sellerShop.api";
//import { toggleSellerLikeApi } from "@/common/api/sellerShop.api";
import { toggleSellerLikeApi } from "@/common/api/wish.api";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useLikeToast } from "@/components/GlobalToast"; //찜토스트
import { useAuth } from "@/hooks/AuthContext";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import BlockModal from "@/components/block/BlockModal";
import {
  getTargetIdIsBlockedApi,
  createBlockApi,
} from "@/common/api/block.api";

const SellerShopPage = () => {
  const { alert, confirm } = useModal();
  const { sellerId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const currentMemberId = user?.memberId;

  const navigate = useNavigate();

  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast(); //찜토스트

  // 판매 상품 목록 & 페이지네이션(커서 기반) 관련 상태/Ref
  // const [products, setProducts] = useState([]);
  const { products, setProducts, onToggleLike } = useLikeToggle();
  const [cursor, setCursor] = useState({
    cursorProductId: null,
    cursorCreatedAt: null,
  });
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  // 차단한 사람인지 체크
  const [isSellerBlocked, setIsSellerBlocked] = useState(false);

  // 메뉴 & 모달 상태
  const [menuOpen, setMenuOpen] = useState(false); // 점 3개 메뉴 오픈
  const [reportModal, setReportModal] = useState(false); // 신고 모달
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false); // 차단 모달
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // 후기
  const [reviewSummary, setReviewSummary] = useState({
    rating5: { totalCount: 0, latestReviews: [], rating: 5 },
    rating4: { totalCount: 0, latestReviews: [], rating: 4 },
  });
  const [reviewLoading, setReviewLoading] = useState(true);

  // 프로필
  const [profile, setProfile] = useState({
    description: "",
    memberId: null,
    nickname: "",
    profileImage: "",
    trustScore: null,
  });

  // 헤더의 rightSlot(점 3개 버튼)이 클릭되면 발생하는 이벤트 수신
  useEffect(() => {
    const handler = () => setMenuOpen(true);
    window.addEventListener("seller-menu-open", handler);

    return () => window.removeEventListener("seller-menu-open", handler);
  }, []);

  // 프로필 함수
  const fetchMemberProfile = useCallback(async () => {
    try {
      const data = await getMemberProfile(sellerId);
      // console.log(data);

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  }, [sellerId]);

  // 리뷰 요약 목록 함수
  const fetchReviewsSummary = useCallback(async () => {
    setReviewLoading(true);

    try {
      const data = await getReceivedReviewSummaryApi(sellerId);
      // console.log(data);

      const { nickname, rating5, rating4 } = data;
      setReviewSummary({ rating5, rating4 });
    } catch (err) {
      console.error(err);
    } finally {
      setReviewLoading(false);
    }
  }, [sellerId]);

  // '판매상품 목록' 조회 요청 함수
  const fetchProductsBySeller = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);

    try {
      const data = await getProductsBySeller({
        sellerId,
        cursorProductId: cursor.cursorProductId,
        cursorCreatedAt: cursor.cursorCreatedAt,
      });
      console.log(data);

      setProducts((prev) => [...prev, ...data.items]);
      setCursor({
        cursorProductId: data.nextCursorProductId,
        cursorCreatedAt: data.nextCursorCreatedAt,
      });
      setHasNext(data.hasNext);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [sellerId, cursor, hasNext, loading]); // cursor, hasNext, loading

  // 차단한 사람인지 체크
  const fetchBlockedSellerState = useCallback(async () => {
    try {
      if (!isAuthenticated || !sellerId) {
        setIsSellerBlocked(false);
        return;
      }

      const data = await getTargetIdIsBlockedApi(Number(sellerId));

      // 백 응답 키: blocked (DTO상 isBlocked이지만 Lombok @getter가 blocked로 내려줌)
      const isBlocked = data?.blocked ?? false;

      setIsSellerBlocked(Boolean(isBlocked));
    } catch (err) {
      console.error("차단 상태 조회 실패:", err);
      setIsSellerBlocked(false);
    }
  }, [isAuthenticated, sellerId]);

  // 초기 fetch
  useEffect(() => {
    setProducts([]);
    setCursor({
      cursorProductId: null,
      cursorCreatedAt: null,
    });
    setHasNext(true);
    setReviewSummary({});

    fetchProductsBySeller();
    fetchReviewsSummary();
    fetchMemberProfile();
    fetchBlockedSellerState(); // 차단한 상태
  }, [sellerId, fetchBlockedSellerState]);
  // 무한 스크롤이면서 첫 로딩도 호출해야 하므로, -> 더 안전하게 동작(??)

  // IntersectionObserver (첫 호출 완료 후 활성화)
  useEffect(() => {
    if (!loadMoreRef.current || products.length === 0) return;
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchProductsBySeller();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNext, loading]); // loadMoreRef, fetchProductsBySeller 제거

  // 셀러 찜 토글
  const handleToggleLikeSeller = async (e) => {
    e.stopPropagation(); // 점 3개 메뉴 이벤트, 상위 이벤트 충돌 방지(이벤트 버블링 방지)

    try {
      const data = await toggleSellerLikeApi(sellerId);
      // console.log(data);

      setProfile((prev) => ({
        ...prev,
        liked: data.liked,
      }));

      if (data.liked) {
        showLikeAddedToast(); // 글로벌토스트함수: 추가 메시지
      } else {
        showLikeRemovedToast(); // 삭제 메시지
      }
    } catch (err) {
      console.error(err);
      alert("좋아요 변경 실패");
    }
  };

  // 상품 목록 찜 토글 기능
  const handleToggleLikeProduct = async (productId) => {
    try {
      const newState = await onToggleLike(productId);
      // console.log(newState);

      setProducts((prev) =>
        prev.map((item) => {
          if (item.productId === productId) {
            return { ...item, wished: newState };
          } else {
            return item;
          }
        })
      );
      return newState;
    } catch (err) {
      console.error(err);
    }
  };

  // 신고 모달 열기
  const handleOpenReportModal = async () => {
    if (!isAuthenticated) {
      const goLogin = await confirm({
        description:
          "신고 기능은 로그인 후 이용 가능합니다.\n 로그인 화면으로 이동하시겠습니까?",
      });
      if (goLogin) {
        navigate("/login");
      }
      return;
    }
    setIsReportModalOpen(true);
    console.log("모달오픈");
  };
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  //신고제출
  const handleSubmitReport = async ({ reasonId, reasonText }) => {
    // if (!detail) return;

    const payload = {
      reasonId,
      targetType: "MEMBER",
      targetId: Number(sellerId),
      // targetId: memberId,
      reasonText: reasonText || null,
    };

    try {
      const result = await createReportApi(payload);
      alert(result?.message || "신고가 접수되었습니다.");
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("신고 제출 실패", error);
      alert("신고 처리 중 문제가 발생했습니다.");
    }
  };

  // 차단 모달 열기
  const handleOpenBlockModal = async () => {
    if (!isAuthenticated) {
      const goLogin = await confirm({
        description:
          "차단 기능은 로그인 후 이용 가능합니다.\n 로그인 화면으로 이동하시겠습니까?",
      });
      if (goLogin) {
        navigate("/login");
      }
      return;
    }
    setIsBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setIsBlockModalOpen(false);
  };

  // 차단 제출
  const handleSubmitBlock = async ({ blockedUserId }) => {
    try {
      const result = await createBlockApi({
        blockedUserId: Number(blockedUserId),
      });

      await fetchBlockedSellerState(); // 이걸로 즉시 반영
      await alert({ description: result?.message });
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error("차단 실패", error);
      await alert({ description: "차단 처리 중 문제가 발생했습니다." });
    }
  };
  return (
    <>
      <Container>
        <div className="px-6 max-w-full mx-auto">
          {/* ---------- 판매자 프로필 ---------- */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="text-gray-400 size-10" />
                )}
              </div>
              <span className="text-2xl">{profile.nickname}</span>
            </div>

            <button onClick={handleToggleLikeSeller} className="cursor-pointer">
              <Heart
                className="size-7 cursor-pointer text-brand-green"
                fill={profile.liked ? "red" : "none"}
                stroke={profile.liked ? "red" : "currentColor"}
              />
            </button>
          </div>

          {/* 차단한 셀러샵인 경우 알려주는 부분 */}
          {isSellerBlocked && (
            <div className="-mt-2 mb-4 pl-2 text-brand-red font-semibold">
              회원님께서 차단한 셀러샵입니다
            </div>
          )}

          {/* ---------- 점수 ---------- */}
          <div className="border rounded-2xl p-4 mb-5">
            <div className="flex justify-between mb-2">
              <span>신뢰점수</span>
              <span className="text-brand-green text-xl">
                {profile.trustScore}
              </span>
            </div>

            <div className="flex justify-between">
              <span>환경점수</span>
              <span className="text-brand-green font-bold text-xl">0.000</span>
            </div>
          </div>

          {/* ---------- 한줄 소개 ---------- */}
          <div className="mb-6">
            <h2 className="mb-3 text-[16px]">한줄 소개</h2>
            <div className="h-12 border rounded-2xl p-4 text-gray-700 text-[16px]">
              {profile.description}
            </div>
          </div>

          {/* ------------- 후기 ------------- */}
          {reviewLoading ? (
            <div>로딩 중...</div>
          ) : (
            <div>
              {reviewSummary.rating5 && (
                <SectionItem
                  title="이런 점이 최고예요"
                  data={reviewSummary.rating5}
                  memberId={sellerId}
                />
              )}

              {reviewSummary.rating4 && (
                <SectionItem
                  title="이런 점이 좋았어요"
                  data={reviewSummary.rating4}
                  memberId={sellerId}
                />
              )}

              <p className="text-gray-400 text-[14px] -mt-1">
                후기는 최신순으로 3건만 보입니다
              </p>
            </div>
          )}

          {/* ---------- 판매 상품 ---------- */}

          <div className="mt-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              판매 상품
            </h3>

            <div>
              <ProductCard
                products={products}
                onToggleLikeInProductList={handleToggleLikeProduct}
              />

              {/* 다음 로딩 중 */}
              {loading && <p>로딩중...</p>}

              {/* 데이터 끝 */}
              {!hasNext && <p className="text-center mt-10">마지막입니다.</p>}

              {/* 무한 스크롤 적용 - loadMoreRef */}
              <div ref={loadMoreRef} style={{ height: "10px" }} />
            </div>
          </div>
        </div>
      </Container>

      {/* ===== 점 세 개 메뉴 ===== */}
      {menuOpen && (
        <>
          {/* 딤 배경 */}
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* 메뉴 박스 */}
          <div className="fixed top-20 right-4 bg-white rounded-xl shadow-xl border w-36 p-2 z-50">
            <Button
              className="w-full text-black p-2 hover:bg-gray-100"
              // onClick={() => {
              //   setMenuOpen(false);
              //   // setReportModal(true);

              // }}
              onClick={handleOpenReportModal}
            >
              신고하기
            </Button>

            <Button
              className="w-full text-black p-2 hover:bg-gray-100"
              onClick={handleOpenBlockModal}
            >
              차단하기
            </Button>
          </div>
        </>
      )}

      {/* ====== 신고 모달 ===== */}
      {/* {reportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-72 p-6 rounded-lg shadow-xl text-center">
            <h2 className="font-semibold mb-4">신고하시겠습니까?</h2>
            <button
              className="bg-brand-green text-white py-2 rounded-lg w-full mb-2"
              onClick={() => setReportModal(false)}
            >
              확인
            </button>
            <button
              className="bg-gray-200 py-2 rounded-lg w-full"
              onClick={() => setReportModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )} */}

      {/* 신고하기 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onclose={handleCloseReportModal}
        onSubmit={handleSubmitReport}
        targetType="MEMBER"
      />

      {/* ==== 차단 모달 ==== */}
      {isBlockModalOpen && (
        <BlockModal
          sellerId={sellerId}
          onClose={handleCloseBlockModal}
          onApply={handleSubmitBlock}
        />
      )}
    </>
  );
};

export default SellerShopPage;
