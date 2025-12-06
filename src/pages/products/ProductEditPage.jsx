import Container from "@/components/Container";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
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
import { updateProductApi } from "@/common/api/product.api";

const ProductEditPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  //기존 정보 불러오기
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!res.ok) throw new Error("상품 정보를 불러오지 못했습니다.");

        const data = await res.json();

        // console.log("서버에서 받은 productStatus:", data.productStatus);
        if (!data) {
          setError("상품 정보를 불러오지 못했습니다");
          return;
        }

        if (data.sellerId !== user?.memberId) {
          setError("이 상품을 수정할 권한이 없습니다.");
          return;
        }

        //백에서 가져온 초기데이터로 폼채우기
        setForm({
          productTitle: data.productTitle,
          categoryDepth1: data.level1Id,
          categoryDepth2: data.level2Id,
          categoryDepth3: data.level3Id,
          sellPrice: data.sellPrice?.toString() ?? "",
          productDescription: data.productDescription,
          productStatus: data.productStatus.name,
          direct: data.direct,
          delivery: data.delivery,
          sellingArea: data.sellingArea,
        });

        setImages(
          data.images.map((img) => ({
            imageId: img.imageId, //기존 이미지의 디비PK
            imageUrl: img.imageUrl,
            preview: img.imageUrl,
            file: null, //기존 이미지는 file없음
            isMain: img.main,
            // isMain: img.isMain ?? img.main ?? img.is_main,
            sortOrder: img.sortOrder, //기존순서
          }))
        );

        setLoading(false);
      } catch (e) {
        console.error(e);
        alert("상품 정보를 불러오는데에 실패했습니다.");
      }
    };
    fetchDetail();
  }, [id, user?.memberId]);

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>{error}</div>;

  //상품 수정
  const handleSubmit = async () => {
    console.log("상품 수정 요청 시작");

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

    //새 이미지 파일만 supabase 업로드 처리
    const finalImages = [];
    let order = 1;

    for (const img of images) {
      let url = img.imageUrl;

      //새로 업로드 필요 이미지
      if (img.file) {
        url = await uploadToSupabase(img.file);
      }

      finalImages.push({
        imageId: img.imageId ?? null,
        imageUrl: url,
        sortOrder: order,
        isMain: img.isMain,
      });
      order++;
    }

    //수정내용 서버로 보내는 patch전용 json 데이터
    const body = {
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
      images: finalImages,
    };

    try {
      const response = await updateProductApi(id, body);
      if (response && response.ok) {
        alert(`상품 수정 완료! 상품ID: ${id}`);
        navigate(`/products/${id}`, { replace: true });
      } else {
        alert("상품 수정 실패");
        console.error("서버 응답 문제:", response);
      }
    } catch (error) {
      console.error(error);
      alert("상품 수정 실패: 서버 또는 네트워크 오류");
    }
  };

  return (
    <Container>
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

        <div className="sticky bottom-0  bg-white border-t z-50 ">
          <ActionButtonBar role="EDITOR" onSubmit={handleSubmit} />
        </div>
      </div>
    </Container>
  );
};
export default ProductEditPage;
