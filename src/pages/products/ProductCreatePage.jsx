import { useState } from "react";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share2,
  ChevronLeft,
  UserRound,
  Heart,
  Eye,
  Smile,
} from "lucide-react";
import ProductCreateHeader from "@/components/product/ProductCreateHeader";
import DetailStickyFooter from "@/components/product/DetailStickyFooter";
import SimilarProductCard from "@/components/product/SimilarProductCard";
import { products } from "@/data/product.js";

function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={
        "w-12.5 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors " +
        (checked ? "bg-[#1B6439]" : "bg-[#1B6439]")
      }
    >
      <div
        className={
          "bg-white w-5 h-5 rounded-full shadow-md transform transition-transform " +
          (checked ? "translate-x-5.5" : "translate-x-0")
        }
      ></div>
    </div>
  );
}

const ProductCreatePage = () => {
  const [aiWrite, setAiWrite] = useState(false);
  return (
    <Container>
      <div>상품등록페이지입니다</div>
      <div>
        <ProductCreateHeader />
      </div>
      <div className="border-b py-3">
        <span className="font-medium ">상품 정보</span>
      </div>
      {/* AI로 작성하기 - 2,3차 개발*/}
      <div className="flex justify-between items-center p-2 my-2 bg-gray-300 rounded-lg">
        <span className="font-medium">AI로 작성하기</span>

        <label className="flex items-center gap-2 cursor-pointer">
          <Toggle checked={aiWrite} onChange={setAiWrite} />
        </label>
      </div>
      {/* 상품 이미지 */}
      <div className="mt-4">
        <p className="font-medium mb-2">상품 이미지</p>
        <div className="flex gap-2 overflow-x-auto">
          <div className="w-20 h-20 border rounded-xl flex items-center justify-center text-gray-400 text-sm">
            4/5
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded-xl overflow-hidden border"
              >
                <img
                  src="/sample.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded-full px-1">
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>{" "}
      {/* 상품명 */}
      <div className="mt-5">
        <input
          placeholder="상품명을 입력해주세요."
          className="w-full border p-3 rounded-lg"
        />
      </div>
      {/* 카테고리 */}
      <div className="mt-5">
        <select className="w-full border p-3 rounded-lg mb-3">
          <option>티켓/쿠폰</option>
        </select>
        <select className="w-full border p-3 rounded-lg mb-3">
          <option>2차 카테고리</option>
        </select>
        <select className="w-full border p-3 rounded-lg">
          <option>3차 카테고리</option>
        </select>
      </div>
      {/* 판매 가격 */}
      <div className="mt-5">
        <input
          placeholder="₩ 판매가격"
          className="w-full border p-3 rounded-lg"
        />
      </div>
      {/* 상품 설명 */}
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium">상품 설명</span>
          <button className="text-sm border px-2 py-1 rounded-lg">
            자주 쓰는 문구
          </button>
        </div>

        <textarea
          className="w-full border p-3 rounded-lg h-32"
          placeholder="상품명
사용(유효) 기간
거래 방법
실제 촬영한 사진과 함께 상세 정보를 입력해주세요."
        />
        <div className="text-right text-gray-400 text-sm">0 / 2000</div>
      </div>
      {/* 상품 상태 */}
      <div className="mt-6">
        <p className="font-medium mb-2">상품 상태</p>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" value="used" />
            중고
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" value="new" />
            새상품
          </label>
        </div>
      </div>
      {/* 거래 방법 */}
      <div className="mt-8">
        <p className="font-medium mb-2">거래 방법</p>

        <label className="flex items-center gap-2">
          <input type="radio" value="delivery" />
          택배거래
        </label>
        <p className="text-gray-400 text-sm ml-6">배송비 포함(무료배송)</p>

        <label className="flex items-center gap-2 mt-3">
          <input type="radio" value="direct" />
          직거래
        </label>

        {/* 직거래 장소
        {dealMethod === "direct" && (
          <div className="flex gap-2 flex-wrap mt-2">
            <span className="px-2 py-1 bg-gray-200 rounded-lg">역삼2동</span>
            <span className="px-2 py-1 bg-gray-200 rounded-lg">양재1동</span>
            <button className="px-2 py-1 border rounded-lg">+ 위치 설정</button>
          </dv>
        )} */}
      </div>
      {/* 환경 점수 - 2,3차 개발*/}
      <div className="mt-8">
        <p className="font-medium mb-2">환경 점수</p>
        <div className="w-full bg-[#1B6439] text-white p-3 flex justify-between rounded-lg">
          <span>환경점수</span>
          <span>100p</span>
        </div>
      </div>
      {/* 판매하기 버튼 */}
      <button className="w-full bg-[#1B6439] text-white py-4 text-lg rounded-lg mt-10">
        판매하기
      </button>
    </Container>
  );
};
export default ProductCreatePage;
