import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import {
  updateProductApi,
  getProductDetailApi,
} from "@/common/api/product.api";
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
import { useHeader } from "@/hooks/HeaderContext";
import AuthStatusIcon from "@/components/AuthStatusIcon";

// 입력 데이터 (DTO 매칭)
const INITIAL_FORM = {
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
};

//안전성위해 외부분리,한번만 생성
const handleBeforeUnload = (e) => {
  e.preventDefault();
  e.returnValue = "";
};

const ProductEditPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [images, setImages] = useState([]);
  const { id } = useParams();
  const [pageLoading, setPageLoading] = useState(true); //읽기로딩
  const [submitLoading, setSubmitLoading] = useState(false); //등록로딩
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setHeader } = useHeader();

  //인증상태확인
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  //기존 정보 불러오기
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchDetail = async () => {
      try {
        setPageLoading(true);
        const data = await getProductDetailApi(id);

        // console.log("서버에서 받은 productStatus:", data.productStatus);
        if (!data) {
          setError("상품 정보를 불러오지 못했습니다.");
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
            sortOrder: img.sortOrder, //기존순서
          }))
        );
      } catch (e) {
        console.error(e);
        alert("상품 정보를 불러오는데에 실패했습니다.");
      } finally {
        setPageLoading(false);
      }
    };
    fetchDetail();
  }, [id, user, isAuthenticated, authLoading]);

  useEffect(() => {
    if (authLoading) return;
    setHeader({
      title: "상품 수정",
      showBack: true,
      rightActions: [
        {
          key: "save",
          label: "임시 저장",
          // onClick: handleSave,
          className: "text-gray-500 font-semibold text-sm cursor-pointer",
        },
        <AuthStatusIcon
          isAuthenticated={isAuthenticated}
          navigate={navigate}
        />,
      ],
    });
  }, [isAuthenticated, navigate, authLoading, setHeader]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //상품 수정
  const handleSubmit = useCallback(async () => {
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

    if (!form.delivery && !form.direct) {
      alert("거래 방법을 1개 이상 선택해주세요.");
      return;
    }

    setSubmitLoading(true);
    setError("");
    try {
      //대표이미지 자동설정 로직
      let adjustedImages = [...images];
      if (
        !adjustedImages.some((img) => img.isMain) &&
        adjustedImages.length > 0
      ) {
        adjustedImages = adjustedImages.map((img, idx) => ({
          ...img,
          isMain: idx === 0,
        }));
      }

      //새 이미지 파일만 supabase 업로드 + 정렬 + 메인지정
      const finalImages = [];
      let order = 1;

      for (const img of adjustedImages) {
        let url = img.imageUrl;

        //새로 업로드 필요 이미지
        if (img.file) {
          url = await uploadToSupabase(img.file);
        }

        finalImages.push({
          imageId: img.imageId ?? null,
          imageUrl: url,
          sortOrder: order++,
          isMain: img.isMain,
        });
      }

      //수정내용 서버로 보내는 patch전용 json 데이터
      const body = {
        ...form,
        images: finalImages,
      };

      const response = await updateProductApi(id, body);
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
    } finally {
      setSubmitLoading(false);
    }
  }, [form, images, navigate, id]);

  // if (submitLoading) return <div>로딩중...</div>;
  // if (error) return <div>{error}</div>;

  if (pageLoading) {
    return (
      <Container>
        <div>불러오는 중…</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <div className="text-center p-4 text-red-600 font-semibold">
          {error}
        </div>
      </Container>
    );
  }
  return (
    <Container>
      {submitLoading && <div>로딩중...</div>}

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
                // setForm((prev) => ({
                //   ...prev,
                //   categoryDepth1:
                //     depth1 != null && depth1 !== "" ? Number(depth1) : null,
                //   categoryDepth2:
                //     depth2 != null && depth2 !== "" ? Number(depth2) : null,
                //   categoryDepth3:
                //     depth3 != null && depth3 !== "" ? Number(depth3) : null,
                // }))
                setForm((prev) => ({
                  //truthy,falsy 체크
                  ...prev,
                  categoryDepth1: depth1 ? Number(depth1) : null,
                  categoryDepth2: depth2 ? Number(depth2) : null,
                  categoryDepth3: depth3 ? Number(depth3) : null,
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
              // onChange={({ delivery, direct }) =>
              //   setForm((prev) => ({ ...prev, delivery, direct }))
              // }
              onChange={(v) => setForm((prev) => ({ ...prev, ...v }))}
            />
          </div>

          {/* 환경 점수 - 2,3차 개발*/}
          <div>
            <EcoScoreSection />
          </div>
        </div>

        <div className="sticky bottom-0  bg-white border-t z-50 ">
          <ActionButtonBar
            role="EDITOR"
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </div>
      </div>
    </Container>
  );
};
export default ProductEditPage;
