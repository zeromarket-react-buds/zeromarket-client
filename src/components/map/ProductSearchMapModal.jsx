import Container from "@/components/Container";
import { CircleX } from "lucide-react";
import ProductMap from "./ProductMap";

const ProductSearchMapModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="fixed inset-0 z-60">
      <div
        className="absolute inset-0 bg-black/40 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="absolute bg-white h-150 rounded-lg m-5 shadow-xl w-lg p-3"
          onClick={handleContentClick}
        >
          <div className="flex justify-end mb-3">
            {/* <CircleX
              className="cursor-pointer bg-brand-green rounded-full text-white"
              onClick={onclose}
            /> */}
          </div>
          <div>검색창 : 지역이나 동네로 검색하기</div>
          <div>이웃과 만나서 거래하고 싶은 장소를 선택해주세요.</div>
          <div>만나서 거래할 때는 누구나 찾기 쉬운 공공장소가 좋아요</div>
          <div className="border h-80 flex-1">
            <ProductMap
              center={{
                lat: 37.5665, // 서울시청 (예시)
                lng: 126.978,
              }}
            />
          </div>
          <button>현재 내 위치 사용하기</button>
          <div className="">
            위치 확인을 위해 위치 정보 사용을 허용해 주세요.
          </div>
          <div className="h-40 flex items-end justify-end">
            <button className="cursor-pointer" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductSearchMapModal;
