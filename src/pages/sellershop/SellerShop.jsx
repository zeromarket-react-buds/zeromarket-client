import Container from "@/components/Container";
import { useNavigate, useParams } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";
import { UserRound, Heart, Settings, MoreVertical } from "lucide-react";
import ProductCard from "@/components/display/ProductCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { getProductsBySeller } from "@/common/api/sellerShop.api";
import { getReceivedReviewSummaryApi } from "@/common/api/review.api";
import { SectionItem } from "../review/ReceivedReviewSummaryPage";
import { getMemberProfile } from "@/common/api/sellerShop.api";
//import { toggleSellerLikeApi } from "@/common/api/sellerShop.api";
import { toggleSellerLikeApi } from "@/common/api/wish.api";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useLikeToast } from "@/components/GlobalToast"; //찜토스트
import { useAuth } from "@/hooks/AuthContext";
import { useModal } from "@/hooks/useModal";
import { getTargetIdIsBlockedApi } from "@/common/api/block.api";
import MenuActionsContainer from "@/components/MenuActionsContainer";

const SellerShopPage = () => {
  const navigate = useNavigate();
  const { alert } = useModal();
  const { sellerId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const currentMemberId = user?.memberId;
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast(); //찜토스트
  const { setHeader } = useHeader();
  const isMe = isAuthenticated && String(user?.memberId) === String(sellerId);

  // 헤더
  useEffect(() => {
    setHeader({
      title: isMe ? "마이 샵" : "셀러 샵",
      showBellWithRightSlot: true,
      rightSlot: isAuthenticated ? (
        isMe ? (
          [<Settings key="settings" onClick={() => navigate("/me/settings")} />]
        ) : (
          <MoreVertical
            key="more"
            size={24}
            className="cursor-pointer"
            onClick={(e) => {
              const anchorEl = e.currentTarget;
              window.dispatchEvent(
                new CustomEvent("seller-menu-open", { detail: { anchorEl } })
              );
            }}
          />
        )
      ) : null,
    });
  }, [setHeader, isMe, isAuthenticated, navigate, sellerId]);

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
  const [anchorEl, setAnchorEl] = useState(null);

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
    environmentScoreTotal: null,
  });

  // 헤더의 rightSlot(점 3개 버튼)이 클릭되면 발생하는 이벤트 수신
  useEffect(() => {
    const handler = (e) => {
      setAnchorEl(e?.detail?.anchorEl ?? null); // 커스텀 이벤트로 보낼 때 detail 안에 데이터를 넣어 전달. 어디 기준으로 띄울지(앵커 요소)를 상태로 저장
      setMenuOpen(true);
    };

    window.addEventListener("seller-menu-open", handler); // 해당 이벤트를 구독
    return () => window.removeEventListener("seller-menu-open", handler); // 컴포넌트가 사라질 때 구독 해제
  }, []); // 페이지 이동 등으로 컴포넌트가 언마운트될 때 이벤트가 남아서 꼬이는 문제를 막음

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
  const fetchProductsBySeller = useCallback(
    async (isFirstLoad = false) => {
      if (isFirstLoad && (!hasNext || loading)) return;
      setLoading(true);

      try {
        const data = await getProductsBySeller({
          sellerId,
          cursorProductId: isFirstLoad ? null : cursor.cursorProductId,
          cursorCreatedAt: isFirstLoad ? null : cursor.cursorCreatedAt,
          includeHidden: isMe,
          // cursorProductId: cursor.cursorProductId,
          // cursorCreatedAt: cursor.cursorCreatedAt,
          // includeHidden: isMe,
        });

        if (isFirstLoad) {
          setProducts(data.items);
        } else {
          setProducts((prev) => [...prev, ...data.items]);
        }

        // console.log(data);

        // setProducts((prev) => [...prev, ...data.items]);
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
    },
    [sellerId, cursor, hasNext, loading, isMe]
  ); // cursor, hasNext, loading

  // //첫페이지 로딩위한 별도의 useEffect
  // useEffect(() => {
  //   if (sellerId) {
  //     fetchProductsBySeller(true);
  //     fetchMemberProfile();
  //     fetchReviewsSummary();
  //     fetchBlockedSellerState();
  //   }
  // }, [sellerId]);

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
    if (!sellerId) return;

    const initFetch = async () => {
      setProducts([]);
      setHasNext(true);
      setCursor({
        cursorProductId: null,
        cursorCreatedAt: null,
      });

      await fetchMemberProfile();
      await fetchBlockedSellerState();
      await fetchReviewsSummary();
      //isMe가 확정될 때까지 fetch를 잠시 미룸
      if (isAuthenticated !== undefined) {
        fetchProductsBySeller(true);
      }
    };
    initFetch();
    // fetchProductsBySeller();
    // fetchReviewsSummary();
    // fetchMemberProfile();
    // fetchBlockedSellerState(); // 차단한 상태
  }, [sellerId, isMe, isAuthenticated]);
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
    //로긴체크
    if (!isAuthenticated) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        //현 셀러샵페이지로 돌아올수있게 redirect 경로 포함
        navigate(`/login?redirect=${window.location.pathname}`);
      }
      return;
    }
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
    //로긴체크
    if (!isAuthenticated) {
      if (
        window.confirm(
          "로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?"
        )
      ) {
        //현 셀러샵페이지로 돌아올수있게 redirect 경로 포함
        navigate(`/login?redirect=${window.location.pathname}`);
      }
      return;
    }

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

  return (
    <>
      <Container>
        <div className="px-6 max-w-full mx-auto cursor-default">
          {/* ---------- 판매자 프로필 ---------- */}
          <div className="flex items-center justify-between pb-6 px-4">
            <div className="flex items-center gap-3">
              <div className="w-15 h-15 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
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
              <span className="text-2xl font-bold ml-2">
                {profile.nickname}
              </span>
            </div>
            {!isMe && (
              <button
                onClick={handleToggleLikeSeller}
                className="cursor-pointer"
              >
                <Heart
                  className="size-9 cursor-pointer text-brand-green"
                  fill={profile.liked ? "red" : "none"}
                  stroke={profile.liked ? "red" : "currentColor"}
                />
              </button>
            )}
          </div>

          {/* 차단한 셀러샵인 경우 알려주는 부분 */}
          {isSellerBlocked && (
            <div className="-mt-2 mb-4 pl-2 text-brand-red font-semibold">
              회원님의 차단 설정에 따라 표시된 셀러샵입니다
            </div>
          )}

          {/* ---------- 점수 ---------- */}
          <div className="border rounded-3xl p-4 mb-6 px-10 cursor-default select-none">
            <div className="flex justify-between items-center mb-2 ">
              <span>신뢰점수</span>
              <span className="text-brand-green font-bold text-xl">
                {profile.trustScore}
              </span>
            </div>

            <div className="flex justify-between items-center text-md ">
              <span>환경점수</span>
              <span className="text-brand-green font-semibold text-xl">
                {profile.environmentScoreTotal
                  ? profile.environmentScoreTotal?.toLocaleString()
                  : 0}
              </span>
            </div>
          </div>

          {/* ---------- 한줄 소개 ---------- */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold pl-2">한줄 소개</h2>
            <div className="flex  items-center border  rounded-3xl p-6 ">
              {profile.description}
            </div>
          </div>

          {/* ------------- 후기 ------------- */}
          {reviewLoading ? (
            <div>로딩 중...</div>
          ) : (
            <div>
              {reviewSummary.rating4 && (
                <SectionItem
                  title="이런 점이 좋았어요"
                  data={reviewSummary.rating4}
                  memberId={sellerId}
                />
              )}
              {reviewSummary.rating5 && (
                <SectionItem
                  title="이런 점이 최고예요"
                  data={reviewSummary.rating5}
                  memberId={sellerId}
                />
              )}

              <p className="text-brand-mediumgray text-sm ">
                후기는 최근 작성된 3건이 표시됩니다
              </p>
            </div>
          )}

          {/* ---------- 판매 상품 ---------- */}

          <div className="mt-8 mb-6">
            <h2 className="mb-4 text-lg font-semibold pl-2">판매 상품</h2>

            <div>
              <ProductCard
                products={products}
                onToggleLikeInProductList={handleToggleLikeProduct}
              />

              {/* 다음 로딩 중 */}
              {loading && <p>로딩중...</p>}

              {/* 데이터 끝 */}
              {!hasNext && (
                <p className="text-center mt-10 text-brand-darkgray">
                  모든 상품을 확인하셨습니다.
                </p>
              )}

              {/* 무한 스크롤 적용 - loadMoreRef */}
              <div ref={loadMoreRef} style={{ height: "10px" }} />
            </div>
          </div>
        </div>

        {/* 점 세 개 메뉴 */}
        {!isMe && isAuthenticated && (
          <MenuActionsContainer
            menuOpen={menuOpen}
            targetMemberId={sellerId}
            setMenuOpen={setMenuOpen}
            reportTargetType="MEMBER"
            onAfterBlock={fetchBlockedSellerState}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        )}
      </Container>

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
    </>
  );
};

export default SellerShopPage;
