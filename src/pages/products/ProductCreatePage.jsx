import { useState } from "react";
import Container from "@/components/Container";
import ActionButtonBar from "@/components/product/ActionButtonBar";
import ProductImageUploader from "@/components/product/ProductImageUploader";
import AiWriteSection from "@/components/product/AiWriteSection";
import CategorySelector from "@/components/product/CategorySelector";
import ProductDescriptionEditor from "@/components/product/ProductDescriptionEditor";
import ProductEcoScoreSection from "@/components/product/EcoScoreSection";
import TradeMethodSelector from "@/components/product/TradeMethodSelector";
import ProductConditionSelector from "@/components/product/ProductConditionSelector";
import ProductTitleInput from "@/components/product/ProductTitleInput";
import ProductPriceInput from "@/components/product/ProductPriceInput";

const ProductCreatePage = () => {
  const [images, setImages] = useState([]);

  return (
    <Container>
      {/* <div>상품등록페이지입니다</div> */}
      <div className="max-w-full mx-auto bg-gray-0 border">
        <div className="px-6">
          <div className="border-b py-4">
            <span className="text-lg font-semibold pl-5">상품 정보</span>
          </div>

          {/* AI로 작성하기 - 2,3차 개발*/}
          <div>
            <AiWriteSection />
          </div>

          {/* 상품 이미지 */}
          <div>
            <ProductImageUploader images={images} setImages={setImages} />
          </div>

          {/* 상품명 */}
          <div>
            <ProductTitleInput />
          </div>

          {/* 카테고리 */}
          <div>
            <CategorySelector />
          </div>

          {/* 판매 가격 */}
          <div>
            <ProductPriceInput />
          </div>

          {/* 상품 설명 */}
          <div>
            <ProductDescriptionEditor />
          </div>

          {/* 상품 상태 */}
          <div>
            <ProductConditionSelector />
          </div>

          {/* 거래 방법 */}
          <div>
            <TradeMethodSelector />
          </div>

          {/* 환경 점수 - 2,3차 개발*/}
          <div>
            <ProductEcoScoreSection />
          </div>
        </div>
        <ActionButtonBar role="WRITER" />
      </div>
    </Container>
  );
};
export default ProductCreatePage;
