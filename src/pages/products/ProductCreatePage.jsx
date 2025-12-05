import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import Container from "@/components/Container";
import ActionButtonBar from "@/components/product/ActionButtonBar";
import ProductImageUploader from "@/components/product/create/ProductImageUploader";
import AiWriteSection from "@/components/product/create/AiWriteSection";
import CategorySelector from "@/components/product/create/CategorySelector";
import ProductDescriptionEditor from "@/components/product/create/ProductDescriptionEditor";
import EcoScoreSection from "@/components/product/create/EcoScoreSection";
import TradeMethodSelector from "@/components/product/create/TradeMethodSelector";
import ProductConditionSelector from "@/components/product/create/ProductConditionSelector";
import ProductTitleInput from "@/components/product/create/ProductTitleInput";
import ProductPriceInput from "@/components/product/create/ProductPriceInput";
import { uploadToSupabase } from "@/lib/supabaseUpload";
import { createProductApi } from "@/common/api/product.api";

const ProductCreatePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // 입력 데이터 (DTO 매칭)
  const [form, setForm] = useState({
    // sellerId: 1, // 로그인 구현 전 임시 값
    productTitle: "",
    categoryDepth1: null,
    categoryDepth2: null,
    categoryDepth3: null,
    sellPrice: "",
    productDescription: "",
    productStatus: "USED", //초기값
    direct: false,
    delivery: false,
    sellingArea: "서울 관악구",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 미로그인시 상품등록X
  useEffect(() => {
    if (!isAuthenticated) {
      alert("로그인 후 상품을 등록할 수 있습니다.");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async () => {
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

    setLoading(true);
    setError("");
    console.log("상품 등록 요청 시작");

    //supabase 이미지 업로드
    const uploadedImages = [];
    for (const img of images) {
      const imageUrl = await uploadToSupabase(img.file);

      uploadedImages.push({
        imageUrl,
        sortOrder: img.sortOrder,
        isMain: img.isMain,
      });
    }

    const jsonData = {
      ...form,
      images: uploadedImages,
    };

    try {
      const response = await createProductApi(jsonData);
      if (response && response.productId) {
        console.log("상품 등록 성공 응답 데이터:", response); // 응답 데이터 확인용
        alert(`상품 등록 완료! 상품ID: ${response.productId}`);
        navigate(`/products/${response.productId}`);
      } else {
        // 서버가 유효한 JSON 대신 null/비어있는 응답을 보냈을 때 처리
        console.error(
          "서버 응답 데이터 문제: 예상된 productId를 찾을 수 없거나 응답이 null입니다.",
          response
        );
        setError(
          "상품 등록은 완료되었을 수 있으나, 서버 응답 형식이 올바르지 않습니다."
        );
        // 임시로 상품 목록으로 이동
        navigate("/products");
      }
    } catch (error) {
      console.error(error);
      setError("상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container>
      <div className="max-w-full mx-auto bg-gray-0  -mb-4 ">
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

          {/* 거래 방법*/}
          <div>
            <TradeMethodSelector
              value={{ delivery: form.delivery, direct: form.direct }}
              onChange={({ delivery, direct }) =>
                setForm((prev) => ({ ...prev, delivery, direct }))
              }
            />
          </div>

          {/* 환경 점수 - 2,3차 개발*/}
          <div>
            <EcoScoreSection />
          </div>
        </div>
        {/* 하단 버튼 */}
        <div className="sticky bottom-0  bg-white border-t z-50 ">
          <ActionButtonBar role="WRITER" onSubmit={handleSubmit} />
        </div>
      </div>
    </Container>
  );
};
export default ProductCreatePage;
