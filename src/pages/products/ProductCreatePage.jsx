import { useState } from "react";
import Container from "@/components/Container";
import { GreenToggle } from "@/components/ui/greentoggle";
import { GreenRadio } from "@/components/ui/greenradio";
import ProductCreateHeader from "@/components/product/ProductCreateHeader";

const ProductCreatePage = () => {
  const [aiWrite, setAiWrite] = useState(false);
  const [condition, setCondition] = useState("used");
  const [tradeMethod, setTradeMethod] = useState("delivery");

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
      <div className="flex justify-between items-center p-2 my-2 bg-gray-200 rounded-lg">
        <span className="">
          <div className="font-medium text-lg">AI로 작성하기</div>
          <div className=" text-[#6C6C6C] text-sm">
            AI 작성 내용은 실제와 다를 수 있고, 수정 가능해요.
          </div>
        </span>

        <label className="flex items-center gap-2 cursor-pointer">
          <GreenToggle checked={aiWrite} onChange={setAiWrite} />
        </label>
      </div>
      {/* 상품 이미지 */}
      <div className="mt-4">
        <p className="font-medium mb-2">상품 이미지</p>
        <div className="flex gap-2 overflow-x-auto">
          <div className="w-20 h-20 border rounded-xl flex items-center justify-center text-gray-400 text-sm">
            4/5
          </div>
        </div>
      </div>
      {/* 상품명 */}
      <div className="mt-5">
        <p className="font-medium mb-2">상품명</p>
        <input
          placeholder="상품명을 입력해 주세요."
          className="w-full border p-3 rounded-lg"
        />
      </div>
      {/* 카테고리 */}
      <div className="mt-5">
        <p className="font-medium mb-2">카테고리</p>
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
        <p className="font-medium mb-2">판매가격</p>
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
        <div className="relative">
          <textarea
            className="w-full border p-3 rounded-lg h-32 overflow-x-auto"
            placeholder="상품명
사용(유효) 기간
거래 방법
실제 촬영한 사진과 함께 상세 정보를 입력해 주세요."
          />
          <div className="absolute bottom-2 right-3 text-right text-[#9A9A9A] text-sm ">
            0 / 2000
          </div>
        </div>
      </div>
      {/* 상품 상태 */}
      <div className="mt-6">
        <p className="font-medium mb-2">상품 상태</p>
        <div className="flex gap-4">
          <GreenRadio
            label="중고"
            value="used"
            checked={condition === "used"}
            onChange={setCondition}
            name="product-condition"
          />
          <GreenRadio
            label="새상품"
            value="new"
            checked={condition === "new"}
            onChange={setCondition}
            name="product-condition"
          />
        </div>
      </div>
      {/* 거래 방법 */}
      <div className="mt-8">
        <p className="font-medium mb-2 border-b">거래 방법</p>
        <div className="gap-2 mt-3">
          <GreenRadio
            label="택배거래"
            value="delivery"
            checked={tradeMethod === "delivery"}
            onChange={setTradeMethod}
            name="trade-method"
          />
          <p className="text-gray-400 text-sm ml-6">배송비 포함(무료배송)</p>
          <GreenRadio
            label="직거래"
            value="direct"
            checked={tradeMethod === "direct"}
            onChange={setTradeMethod}
            name="trade-method"
          />
        </div>

        {/* 직거래 선택시 뜨는 장소 */}
        {tradeMethod === "direct" && (
          <div className="flex gap-2 flex-wrap mt-2 ml-7">
            <span className="px-2 py-1 bg-gray-200 rounded-2xl">역삼2동</span>
            <span className="px-2 py-1 bg-gray-200 rounded-2xl">방화제1동</span>
            <button className="px-2 py-1 border rounded-2xl">
              + 위치 설정
            </button>
          </div>
        )}
      </div>
      {/* 환경 점수 - 2,3차 개발*/}
      <div className="mt-8">
        <p className="font-medium mb-2 border-b">환경 점수</p>
        <div className="w-full bg-[#1B6439] text-white p-3 flex justify-between rounded-lg">
          <span>환경점수</span>
          <span>100p</span>
        </div>
      </div>
      {/* 판매하기 버튼 -하단sticky임*/}
      <button className="w-full bg-[#1B6439] text-white py-4 text-lg rounded-lg mt-10">
        판매하기
      </button>
    </Container>
  );
};
export default ProductCreatePage;
