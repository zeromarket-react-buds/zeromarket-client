import { useRef, useState } from "react";
import Container from "@/components/Container";
import { GreenToggle } from "@/components/ui/greentoggle";
import { GreenRadio } from "@/components/ui/greenradio";
import { ChevronDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductHeader from "@/components/product/ProductHeader";
import ProductFooter from "@/components/product/ProductFooter";
import ProductImageUploader from "@/components/product/ProductImageUploader";

const categories = [
  {
    id: 1,
    options: ["1차 카테고리", "디지털", "의류"],
    placeholder: "1차 카테고리",
  },
  {
    id: 2,
    options: ["2차 카테고리", "서브카테고리1", "서브카테고리2"],
    placeholder: "2차 카테고리",
  },
  {
    id: 3,
    options: ["3차 카테고리", "세부1", "세부2"],
    placeholder: "3차 카테고리",
  },
];

const ProductCreatePage = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);
  const [aiWrite, setAiWrite] = useState(false);
  const [condition, setCondition] = useState("used");
  const [tradeMethod, setTradeMethod] = useState("delivery");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });

  const clearInput = () => {
    setTitle("");
    requestAnimationFrame(() => {
      inputRef.current.focus();
    });
  };

  const formatNumber = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return parseInt(numericValue, 10).toLocaleString();
  };

  const handelPrice = (e) => {
    const value = e.target.value;
    setPrice(formatNumber(value));
  };

  return (
    <Container>
      <div>상품등록페이지입니다</div>
      <div className="max-w-full mx-auto bg-gray-0 border">
        <div>
          <ProductHeader type="register" />
        </div>
        <div className="px-6">
          <div className="border-b py-4">
            <span className="text-lg font-semibold pl-5">상품 정보</span>
          </div>
          {/* AI로 작성하기 - 2,3차 개발*/}
          <div className="flex justify-between items-center p-4 py-5 my-5 bg-gray-200 rounded-xl">
            <span>
              <div className="font-medium text-lg">AI로 작성하기</div>
              <div className=" text-brand-darkgray text-sm">
                AI 작성 내용은 실제와 다를 수 있고, 수정 가능해요.
              </div>
            </span>

            <div className="flex items-center cursor-pointer  ">
              <GreenToggle
                checked={aiWrite}
                onChange={setAiWrite}
                className="size"
              />
            </div>
          </div>

          {/* 상품 이미지 */}
          <div>
            <ProductImageUploader images={images} setImages={setImages} />
          </div>

          {/* 상품명 */}
          <div className="mt-5">
            <p className="font-medium mb-2 text-lg">상품명</p>
            <div className="relative">
              <input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="상품명을 입력해 주세요."
                className="w-full border p-3 rounded-lg"
              />
              {title && (
                <button
                  type="button"
                  onClick={clearInput}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-600 rounded-full p-0.5 w-5 h-5 flex items-center justify-center"
                >
                  <X className="stroke-2 w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="mt-5">
            <p className="font-medium mb-2 text-lg">카테고리</p>
            {categories.map((item, idx) => (
              <div className="relative w-full mb-3">
                <select
                  className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm"
                  value={selectedCategories[`c${item.id}`]}
                  onChange={(e) =>
                    setSelectedCategories((prev) => ({
                      ...prev,
                      [`category${item.id}`]: e.target.value,
                    }))
                  }
                >
                  {item.options.map((op, i) => (
                    <option key={i}>{op}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-6 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* 판매 가격 */}
          <div className="mt-5">
            <p className="font-medium mb-2 text-lg">판매가격</p>
            <input
              value={price}
              onChange={handelPrice}
              placeholder="₩ 판매가격"
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* 상품 설명 */}
          <div className="mt-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-lg">상품 설명</span>
              <button className="text-sm font-light border px-2 py-1 rounded-lg">
                자주 쓰는 문구
              </button>
            </div>
            <div className="relative">
              <textarea
                className="w-full border p-3 rounded-lg h-32 text-sm overflow-x-auto"
                placeholder="상품명
사용(유효) 기간
거래 방법
실제 촬영한 사진과 함께 상세 정보를 입력해 주세요."
              />
              <div className="absolute bottom-2 right-3 py-2 text-right text-brand-mediumgray text-sm ">
                0 / 2000
              </div>
            </div>
          </div>

          {/* 상품 상태 */}
          <div className="mt-6">
            <p className="font-medium mb-2 text-lg">상품 상태</p>
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
            <p className="font-bold mb-2 border-b py-1 text-lg">거래 방법</p>
            <div className=" mt-3">
              <GreenRadio
                label="택배거래"
                value="delivery"
                checked={tradeMethod === "delivery"}
                onChange={setTradeMethod}
                name="trade-method"
              />
              <p className="text-gray-400 text-sm mt-1 mb-5">
                배송비 포함(무료배송)
              </p>
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
              <div className="flex gap-2 flex-wrap mt-2 ">
                <Button className="bg-gray-200 text-black rounded-3xl">
                  <span>역삼2동</span>
                  <span>
                    <X className="text-brand-darkgray" />
                  </span>
                </Button>
                <Button className="bg-gray-200 text-black rounded-3xl">
                  <span>방화제1동</span>
                  <span>
                    <X className="text-brand-darkgray" />
                  </span>
                </Button>
                <Button className="bg-white border-2 border-gray-200 text-black rounded-3xl">
                  <span>
                    <Plus className="text-brand-darkgray" />
                  </span>
                  <span>위치 설정</span>
                </Button>
              </div>
            )}
          </div>
          {/* 환경 점수 - 2,3차 개발*/}
          <div className="mt-8 mb-20">
            <p className="font-bold py-3 border-b text-lg">환경 점수</p>
            <div className="w-full bg-brand-green text-white p-3 my-5 flex justify-between rounded-lg">
              <span>환경점수</span>
              <span>100p</span>
            </div>
          </div>
        </div>
        <ProductFooter role="WRITER" />
      </div>
    </Container>
  );
};
export default ProductCreatePage;
