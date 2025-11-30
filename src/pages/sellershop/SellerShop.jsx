import Container from "@/components/Container";
import { UserRound, Heart } from "lucide-react";
import ProductCard from "@/components/display/ProductCard";
import { useEffect, useState } from "react";

const SellerShopPage = () => {
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

            <ProductCard products={detail.products} onToggleLike={() => {}} />
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
              onClick={() => {
                setMenuOpen(false);
                setReportModal(true);
              }}
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
      {reportModal && (
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
      )}

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
