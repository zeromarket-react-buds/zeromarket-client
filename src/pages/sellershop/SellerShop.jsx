import Container from "@/components/Container";
import { UserRound, Heart } from "lucide-react";
import ProductCard from "@/components/display/ProductCard";
import { useEffect, useState } from "react";

const SellerShopPage = () => {
  // UI 전용 더미 데이터 — 나중에 fetch로 교체 가능
  const [detail, setDetail] = useState({
    sellerNickName: "판매자닉네임",
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

  return (
    <Container>
      <div className="px-6 max-w-full mx-auto">
        {/* ---------- 판매자 프로필 ---------- */}
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center">
              <UserRound className="text-brand-ivory size-10" />
            </div>
            <span className="font-semibold text-brand-green text-2xl">
              {detail.sellerNickName}
            </span>
          </div>

          <Heart className="size-7 text-brand-green cursor-pointer" />
        </div>

        {/* ---------- 점수 ---------- */}
        <div className="border rounded-2xl p-4 mb-2">
          <div className="flex justify-between mb-3">
            <span>신뢰점수</span>
            <span className="text-brand-green font-bold text-[20px]">
              {detail.trustScore}
            </span>
          </div>

          <div className="flex justify-between">
            <span>환경점수</span>
            <span className="text-brand-green font-bold text-[20px]">
              {detail.environmentScore.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center mb-6">
          점수는 최신 기준으로 산정됩니다.
        </p>

        {/* ---------- 한줄 소개 ---------- */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2 text-[16px]">한줄 소개</h2>
          <div className="border rounded-2xl p-3 text-gray-700 text-[16px]">
            {detail.introduction}
          </div>
        </div>

        {/* ---------- 이런 점이 좋았어요 ---------- */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-[16px]">
              이런 점이 좋았어요
            </span>
            <span className="text-gray-600 text-sm">
              {detail.goodReviews.length}건
            </span>
          </div>

          <div className="border rounded-2xl p-4">
            <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-1">
              {detail.goodReviews.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <button className="text-brand-green text-sm mt-2">더 보기</button>
          </div>
        </div>

        {/* ---------- 이런 점이 최고였어요 ---------- */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-[16px]">
              이런 점이 최고였어요
            </span>
            <span className="text-gray-600 text-sm">
              {detail.bestReviews.length}건
            </span>
          </div>

          <div className="border rounded-2xl p-4">
            <ul className="list-disc pl-5 text-gray-700 text-[15px] space-y-1">
              {detail.bestReviews.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            <button className="text-brand-green text-sm mt-2">더 보기</button>
          </div>
        </div>

        {/* ---------- 판매 상품 ---------- */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            판매 상품
          </h3>

          <ProductCard products={detail.products} onToggleLike={() => {}} />
        </div>
      </div>
    </Container>
  );
};

export default SellerShopPage;
