import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Share2,
  ChevronLeft,
  UserRound,
  Heart,
  Eye,
  Smile,
} from "lucide-react";
import DetailStickyHeader from "@/components/DetailStickyHeader";
import DetailStickyFooter from "@/components/DetailStickyFooter";
import SimilarProductCard from "@/components/SimilarProductCard";
import { products } from "@/data/product.js";

const ProductDetailPage = () => {
  return (
    <Container>
      <div>상품상세페이지입니다</div>
      <div className="max-w-sm mx-auto bg-gray-0 border">
        <DetailStickyHeader />
        <div className="relative">
          {/* 사진 영역 */}
          <div className="bg-gray-200 w-full h-70 flex items-center justify-center text-gray-600">
            사진
          </div>
          <div className="absolute bottom-2 right-2 m-2">
            <span>1 </span>/ <span>5</span>
          </div>
        </div>

        <div className="px-6">
          {/* 사진 아래영역 */}
          <div className="max-w-lg mx-auto py-5 bg-white">
            {/* 닉네임과 관련 정보 */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 ">
                <div className="w-12 h-12 bg-[#1B6439] rounded-full flex items-center justify-center text-[#FAF3E5] font-semibold">
                  <UserRound className="size-15" />
                </div>
                <span className="font-semibold text-[#1B6439] text-2xl">
                  닉네임
                </span>
              </div>

              {/* 상호작용 정보 */}
              <div className="flex items-center gap-5 px-1">
                {/* 조회수 */}
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-[#1B6439]">
                    12
                  </span>
                  <span className="text-sm text-[#9A9A9A]">
                    <Eye className="size-4" />
                  </span>
                </div>

                {/* 관심수 */}
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-[#1B6439]">
                    3
                  </span>
                  <span className="text-sm  text-[#9A9A9A]">
                    <Heart className="size-4" />
                  </span>
                </div>

                {/* 이모지 */}
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold text-[#1B6439]">
                    5
                  </span>
                  <span className=" text-[#9A9A9A]">
                    <Smile className="size-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 상품명 */}

          <div className="text-2xl font-bold mb-2 ">
            상품명이 길어질 수도 있음
          </div>

          {/* 가격 & 예약중 */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-lg font-bold text-[#1B6439]">예약중</span>
            <span className="text-lg font-semibold">5,000원</span>
          </div>
          {/* 옵션 */}
          <div className="flex justify-between items-center my-3">
            <span className=" text-gray-600 text-base hover:underline">
              <span>1뎁스 </span>/ <span>2뎁스 </span>/ <span>3뎁스</span>
            </span>
            <span className="text-sm text-gray-500">3시간 전</span>
          </div>

          {/* 상품상태 */}
          <div className="flex justify-between items-center my-5 w-full border rounded-lg px-3 py-2 text-sm">
            <span>상품상태</span>
            <span>중고</span>
          </div>

          {/* 설명 */}
          <div className="mb-4">
            <div className=" font-semibold mb-2">설명</div>
            <p className="">사용감이 적은 편입니다.</p>
          </div>
          {/* 환경점수 - 2,3차 */}
          <div className="flex items-center justify-between border-t py-3 mb-10">
            <span className="">환경점수</span>
            <span className="text-[#1B6439] text-2xl font-extrabold flex gap-3">
              <span>+</span>
              <span>50p</span>
            </span>
          </div>

          {/* 하단 안내 */}
          <div className=" my-5 text-sm text-[#6C6C6C] border-b py-3">
            <div>환경을 생각하는 0000님, </div>
            <div> 이 물품을 구입하면 30mg 탄소절감이 됩니다! </div>
          </div>
          {/* 거래 정보 */}
          <div className=" my-5 text-sm text-[#6C6C6C] ">
            <div className="flex justify-between mb-4">
              <span>거래방법</span>
              <div>
                <span>직거래</span> | <span>택배거래 가능</span>
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <span>거래위치</span>
              <span>지정 위치</span>
            </div>
            {/* 맵(2차-직거래만 노출) */}
            <div className="bg-gray-200 w-full h-55 flex items-center justify-center text-gray-600">
              맵
            </div>
          </div>
          {/* 신고하기 버튼 */}
          <div className="mb-6">
            <button className="">신고하기</button>
          </div>

          {/* 비슷한 상품 */}
          <div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 my-3">
                비슷한 물품
              </h3>
              <div className="grid grid-cols-2 gap-1">
                {products.map((p) => (
                  <SimilarProductCard key={p.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <DetailStickyFooter />
      </div>
    </Container>
  );
};
export default ProductDetailPage;
