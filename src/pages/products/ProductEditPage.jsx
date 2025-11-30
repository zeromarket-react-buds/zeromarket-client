import Container from "@/components/Container";
import { useParams } from "react-router-dom";
import { useState } from "react";
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
import { uploadToSupabase } from "@/lib/supabaseUpload";

const ProductEditPage = () => {
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const { id } = useParams();

  // 입력 데이터 (DTO 매칭)
  const [form, setForm] = useState({
    sellerId: 1, // 로그인 구현 전 임시 값
    productTitle: "",
    categoryDepth1: null,
    categoryDepth2: null,
    categoryDepth3: null,
    sellPrice: "",
    // sellPrice: Number(form.sellPrice.toString().replace(/,/g, "")),
    productDescription: "",
    productStatus: "USED", //초기값
    direct: false,
    delivery: false,
    sellingArea: "서울 관악구",
  });

  const handleSubmit = async () => {
    console.log("상품 등록 요청 시작");

    if (!form.productTitle.trim()) {
      alert("상품명을 입력해주세요.");
      return;
    }

    if (!form.sellPrice) {
      alert("판매 가격을 입력해주세요.");
      return;
    }

    if (!Number(form.categoryDepth3)) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    const fd = new FormData();

    const jsonData = {
      sellerId: form.sellerId,
      productTitle: form.productTitle,
      categoryDepth1: form.categoryDepth1,
      categoryDepth2: form.categoryDepth2,
      categoryDepth3: form.categoryDepth3,
      sellPrice: form.sellPrice,
      productDescription: form.productDescription,
      productStatus: form.productStatus,
      direct: form.direct,
      delivery: form.delivery,
      sellingArea: form.sellingArea,
      imageUrls: uploadUrls,
      mainImageIndex: mainIndex,
    };

    //JSON
    fd.append(
      "data",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );
    //이미지 파일
    images.forEach((img) => {
      fd.append("images", img.file);
    });

    try {
      const res = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.log(jsonData);
        console.error("서버오류 내용:", errorText);
        alert("상품 등록 실패 (서버오류)");
        return;
      }

      const newProductId = await res.json();
      alert("상품 등록 완료! 상품ID: " + newProductId);
    } catch (error) {
      console.error(error);
      alert("오류 발생");
    }
  };
  return (
    <Container>
      <div>상품수정페이지 / 현재 수정중 상품 ID : {id}</div>
      <div className="max-w-full mx-auto bg-gray-0 -mb-4 ">
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
            <ProductTitleInput
              value={form.productTitle}
              onChange={(t) => setForm({ ...form, productTitle: t })}
            />
          </div>

          {/* 카테고리 */}
          <div>
            <CategorySelector
              value={{
                depth1: form.categoryDepth1,
                depth2: form.categoryDepth2,
                depth3: form.categoryDepth3,
              }}
              onChange={(depth1, depth2, depth3) =>
                // setForm({
                //   ...form,
                //   categoryDepth1: depth1,
                //   categoryDepth2: depth2,
                //   categoryDepth3: depth3,
                // })
                setForm((prev) => ({
                  ...prev,
                  categoryDepth1:
                    depth1 != null && depth1 !== "" ? Number(depth1) : null,
                  categoryDepth2:
                    depth2 != null && depth2 !== "" ? Number(depth2) : null,
                  categoryDepth3:
                    depth3 != null && depth3 !== "" ? Number(depth3) : null,
                }))
              }
            />
          </div>

          {/* 판매 가격 */}
          <div>
            <ProductPriceInput
              value={form.sellPrice}
              onChange={(p) => setForm({ ...form, sellPrice: p })}
            />
          </div>

          {/* 상품 설명 */}
          <div>
            <ProductDescriptionEditor
              value={form.productDescription}
              onChange={(d) => setForm({ ...form, productDescription: d })}
            />
          </div>

          {/* 상품 상태 */}
          <div>
            <ProductConditionSelector
              value={form.productStatus}
              onChange={(s) => setForm({ ...form, productStatus: s })}
            />
          </div>

          {/* 거래 방법 
          직거래 택배거래 둘다 가능하게 변경예정, radio에서 checkbox로 변경예정 
          */}
          <div>
            <TradeMethodSelector
              value={form.direct ? "direct" : "delivery"}
              onChange={(method) => {
                if (method === "direct") {
                  setForm({ ...form, direct: true, delivery: false });
                } else {
                  setForm({ ...form, direct: false, delivery: true });
                }
              }}
            />
          </div>

          {/* 환경 점수 - 2,3차 개발*/}
          <div>
            <ProductEcoScoreSection />
          </div>
        </div>
        <div className="sticky bottom-0  bg-white border-t z-50 ">
          <ActionButtonBar role="EDITOR" />
        </div>
      </div>
    </Container>
  );
};
export default ProductEditPage;
