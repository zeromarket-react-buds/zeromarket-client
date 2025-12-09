import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";
import { UserRound, Heart } from "lucide-react";
import ProductCard from "@/components/display/ProductCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { createReportApi } from "@/common/api/report.api";
import ReportModal from "@/components/report/ReportModal";
import { getProductsBySeller } from "@/common/api/sellerShop.api";

const SellerShopPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // 로그인된 상태 (더미 데이터)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [memberId, setMemberId] = useState(12345); // 더미 memberId (로그인된 사용자 ID)
  const navigate = useNavigate();

  // UI 전용 더미 데이터 — 나중에 fetch로 교체 가능
  const [detail] = useState({
    sellerNickName: "판매자 닉네임",
    trustScore: 4.5,
    environmentScore: 4000,
    introduction: "빠른 확인 가능합니다",
    goodReviews: [
      "이런 점이 좋았어요",
      "저런 점이 좋았어요",
      "요런 점이 좋았어요",
    ],
    bestReviews: ["정말 친절했어요", "응답이 빨랐어요", "거래가 최고였습니다!"],
    products: [
      {
        productId: 1,
        productTitle: "실제로 들어갈 상품명",
        sellPrice: 20000,
        thumbnailUrl: "",
        salesStatus: "RESERVED",
        liked: false,
      },
      {
        productId: 2,
        productTitle: "또 다른 상품명",
        sellPrice: 35000,
        thumbnailUrl: "",
        salesStatus: "ON_SALE",
        liked: false,
      },
    ],
  });
  // 목록 & 페이지네이션(커서 기반) 관련 상태/Ref
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState({
    cursorProductId: null,
    cursorCreatedAt: null,
  });
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  // 메뉴 & 모달 상태
  const [menuOpen, setMenuOpen] = useState(false); // 점 3개 메뉴 오픈
  const [reportModal, setReportModal] = useState(false); // 신고 모달
  const [blockModal, setBlockModal] = useState(false); // 차단 모달

  // 헤더의 rightSlot(점 3개 버튼)이 클릭되면 발생하는 이벤트 수신
  useEffect(() => {
    const handler = () => setMenuOpen(true);
    window.addEventListener("seller-menu-open", handler);

    return () => window.removeEventListener("seller-menu-open", handler);
  }, []);

  // 판매상품 목록 조회 요청 함수
  const fetchProductsBySeller = useCallback(async () => {
    if (!hasNext || loading) return;
    setLoading(true);

    try {
      const data = await getProductsBySeller({
        // TODO: sellerId 가져오기
        sellerId: 1,
        cursorProductId: cursor.cursorProductId,
        cursorCreatedAt: cursor.cursorCreatedAt,
      });
      console.log(data);

      setItems((prev) => [...prev, ...data.items]);
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
  });

  // 판매상품 목록 조회 useEffect
  useEffect(() => {
    fetchProductsBySeller();
  }, []); // 최초 렌더링 딱 한 번

  // 판매상품 목록 조회 - 페이지네이션(커서 기반)
  useEffect(() => {
    if (!loadMoreRef.current) return;

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

  // UX 강화
  // - 새로고침 시 첫 페이지부터 로드
  // - 판매자 화면 이동 시 상태 reset
  // useEffect(() => {
  //   setItems([]);
  //   setCursor({ cursorProductId: null, cursorCreatedAt: null });
  //   setHasNext(true);
  //   loadData();
  // }, [sellerId]);

  const handleOpenReportModal = () => {
    if (!isAuthenticated) {
      const goLogin = window.confirm(
        "신고 기능은 로그인 후 이용 가능합니다. 로그인 화면으로 이동하시겠습니까?"
      );
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
    if (!detail) return;

    const payload = {
      reasonId,
      targetType: "MEMBER",
      targetId: memberId,
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
  return (
    <>
      <Container>
        <div className="px-6 max-w-full mx-auto">
          {/* ---------- 판매자 프로필 ---------- */}
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center">
                <UserRound className="text-brand-ivory size-10" />
              </div>
              <span className="text-2xl">{detail.sellerNickName}</span>
            </div>

            <Heart className="size-7 text-brand-green cursor-pointer" />
          </div>

          {/* ---------- 점수 ---------- */}
          <div className="border rounded-2xl p-4 mb-5">
            <div className="flex justify-between mb-2">
              <span>신뢰점수</span>
              <span className="text-brand-green text-xl">
                {detail.trustScore}
              </span>
            </div>

            <div className="flex justify-between">
              <span>환경점수</span>
              <span className="text-brand-green font-bold text-xl">
                {detail.environmentScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* ---------- 한줄 소개 ---------- */}
          <div className="mb-6">
            <h2 className="mb-3 text-[16px]">한줄 소개</h2>
            <div className="border rounded-2xl p-4 text-gray-700 text-[16px]">
              {detail.introduction}
            </div>
          </div>

          {/* 이런 점이 좋았어요 */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className=" text-[16px]">이런 점이 좋았어요</span>
              {/*건수증가, 건텍스트 크기*/}
              <span className=" text-[16px]">
                {/*증가 숫자 색상크기 지정*/}
                <span className="text-brand-green text-lg font-semibold">
                  {detail.bestReviews.length}
                </span>
                건
              </span>
            </div>

            <div className="border rounded-2xl p-4">
              <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-1">
                {/* 최대 3건까지만 표시하도록 slice */}
                {detail.goodReviews.slice(0, 3).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-sm">더 보기</p>
            </div>
          </div>

          {/* 이런 점이 최고예요  */}
          <div className="mb-6">
            <div className="flex justify-between mb-3">
              <span className=" text-[16px]">이런 점이 최고예요</span>
              <span className="text-[16px]">
                <span className="text-brand-green text-lg font-semibold">
                  {detail.bestReviews.length}
                </span>
                건
              </span>
            </div>

            <div className="border rounded-2xl p-4">
              <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-1">
                {/* 최대 3건까지만 표시하도록 slice */}
                {detail.bestReviews.slice(0, 3).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center mt-2">
              <p className="text-sm">더 보기</p>
            </div>
          </div>

          <p className="text-gray-400 text-[14px] -mt-1">
            후기는 최신순으로 3건만 보입니다
          </p>

          {/* ---------- 판매 상품 ---------- */}
          <div className="mt-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              판매 상품
            </h3>

            {/* <ProductCard products={detail.products} onToggleLike={() => {}} /> */}
            <ProductCard products={items} onToggleLike={() => {}} />

            {/* 다음 로딩 중 */}
            {loading && <p>로딩중...</p>}

            {/* 데이터 끝 */}
            {!hasNext && <p>마지막입니다.</p>}

            {/* 무한 스크롤 적용 - loadMoreRef */}
            <div ref={loadMoreRef} style={{ height: "10px" }} />
          </div>
        </div>
      </Container>

      {/* ===== 점 세 개 메뉴 ===== */}
      {menuOpen && (
        <>
          {/* 딤 배경 */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* 메뉴 박스 */}
          <div className="fixed top-20 right-4 bg-white rounded-xl shadow-xl border w-36 p-2">
            <button
              className="w-full text-left p-2 hover:bg-gray-100"
              // onClick={() => {
              //   setMenuOpen(false);
              //   // setReportModal(true);

              // }}
              onClick={handleOpenReportModal}
            >
              신고하기
            </button>

            <button
              className="w-full text-left p-2 hover:bg-gray-100"
              onClick={() => {
                setMenuOpen(false);
                setBlockModal(true);
              }}
            >
              차단하기
            </button>
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
      {blockModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-72 p-6 rounded-lg shadow-xl text-center">
            <h2 className="font-semibold mb-4">차단하시겠습니까?</h2>
            <button
              className="bg-red-500 text-white py-2 rounded-lg w-full mb-2"
              onClick={() => setBlockModal(false)}
            >
              차단하기
            </button>
            <button
              className="bg-gray-200 py-2 rounded-lg w-full"
              onClick={() => setBlockModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerShopPage;
