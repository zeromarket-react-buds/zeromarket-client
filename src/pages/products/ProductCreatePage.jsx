import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import Container from "@/components/Container";
import ActionButtonBar from "@/components/product/ActionButtonBar";
import ProductImageUploader from "@/components/product/create/ProductImageUploader";
import AiWriteSection from "@/components/product/create/AiWriteSection";
import CategorySelector from "@/components/product/create/CategorySelector";
import EcoScoreSection from "@/components/product/create/EcoScoreSection";
import TradeMethodSelector from "@/components/product/create/TradeMethodSelector";
import ProductConditionSelector from "@/components/product/create/ProductConditionSelector";
import ProductTitleInput from "@/components/product/create/ProductTitleInput";
import ProductPriceInput from "@/components/product/create/ProductPriceInput";
import { uploadToSupabase } from "@/lib/supabaseUpload";
import { createProductApi } from "@/common/api/product.api";
import { useHeader } from "@/hooks/HeaderContext";
import AuthStatusIcon from "@/components/AuthStatusIcon";
import ProductVisionBridge from "@/components/product/create/ProductVisionBridge";
import ProductDescriptionEditor from "@/components/product/create/ProductDescriptionEditor";
import FrequentPhraseModal from "@/components/product/create/frequent-phrase/FrequentPhraseModal";
import { getProductCustomTextsApi } from "@/common/api/customText.api"; //자주 쓰는 문구 목록불러오기 API
import useProductVisionAi from "@/hooks/useProductVisionAi";

// 입력 데이터 (DTO 매칭)
const INITIAL_FORM = {
  productTitle: "",
  categoryDepth1: null,
  categoryDepth2: null,
  categoryDepth3: null,
  sellPrice: "",
  productDescription: "",
  productStatus: "USED", //초기값
  direct: false,
  delivery: false,
  sellingArea: "",
  environmentScore: null,
  location: null,
  aiWriteEnabled: false,
};

const handleBeforeUnload = (e) => {
  e.preventDefault(); //브라우저 기본동작 막기
  e.returnValue = ""; //기본 confirm 창 띄우게
};

const ProductCreatePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const routerLocation = useLocation();
  const [images, setImages] = useState(() => {
    return routerLocation.state?.images ?? [];
  });
  const [form, setForm] = useState(() => {
    return routerLocation.state?.form ?? INITIAL_FORM;
    // if (routerLocation.state?.form) {
    //   return routerLocation.state.form;
    // }
    // return INITIAL_FORM;
  });
  // const [images, setImages] = useState([]);
  const navigate = useNavigate();
  const { setHeader } = useHeader();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  // const [selectedLocation, setSelectedLocation] = useState(null); // ProductLocationDto 객체 전체를 저장

  // 자주 쓰는 문구 모달
  const [isPhraseModalOpen, setIsPhraseModalOpen] = useState(false);

  //mock 데이터
  //문구 목록 state
  const [phrases, setPhrases] = useState([
    // { id: 1, text: "자주 쓰는 문구 1" },
    // { id: 2, text: "자주 쓰는 문구 1" },
    // { id: 3, text: "자주 쓰는 문구 1" },
  ]);

  //서버에서 자주 쓰는 문구 목록 불러오기
  useEffect(() => {
    const loadPhrases = async () => {
      try {
        const data = await getProductCustomTextsApi();
        console.log("자주 쓰는 문구 조회 결과 👉", data);

        setPhrases(data); //서버 데이터로 교체
      } catch (e) {
        console.error("자주 쓰는 문구 불러오기 실패", e);
      }
    };

    loadPhrases();
  }, []);

  //등록 후 재조회용 함수
  const reloadPhrases = useCallback(async () => {
    const updated = await getProductCustomTextsApi();
    setPhrases(updated);
  }, []);

  // vision/aiDraft/mainImage 관련은 훅으로 이동
  const {
    mainImage,

    vision,

    aiWriteEnabled,
    setAiWriteEnabled,

    handleVisionResult,
    handleVisionReset,

    handleVisionLoading,
    handleVisionError,
  } = useProductVisionAi({ images, form, setForm });

  // 직거래 위치 선택 후 복귀 처리
  useEffect(() => {
    if (routerLocation.state?.selectedLocation) {
      const previousForm = routerLocation.state.form;
      const previousImages = routerLocation.state.images;

      setForm((prev) => ({
        ...(previousForm || prev),
        location: routerLocation.state.selectedLocation,
        direct: true,
      }));
      if (previousImages) {
        setImages(previousImages);
      }
      navigate(routerLocation.pathname, { replace: true, state: undefined });
    }
  }, [routerLocation.state, navigate, routerLocation.pathname]);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      alert("로그인 후 상품을 등록할 수 있습니다.");
      navigate("/login", { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (authLoading) return;
    setHeader({
      title: "상품 등록",
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
    window.addEventListener("beforeunload", handleBeforeUnload); //"beforeunload"기존 정의 특수이벤
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleSubmit = useCallback(async () => {
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

    if (form.direct && !form.location) {
      alert("직거래 위치를 선택해주세요.");
      return;
    }

    if (
      form.direct &&
      (!form.location ||
        !form.location.legalDongCode ||
        !form.location.latitude ||
        !form.location.longitude)
    ) {
      console.log(
        "직거래를 선택했다면, 정확한 거래 위치 정보를 모두 설정해야 합니다.",
        form.location,
        form.location.legalDongCode,
        form.location.latitude,
        form.location.longitude
      );
      alert(
        "직거래를 선택했다면, 정확한 거래 위치 정보를 모두 설정해야 합니다."
      );
      return;
    }

    setSubmitLoading(true);
    setError("");
    console.log("상품 등록 요청 시작");

    try {
      //대표이미지 자동설정 로직
      let adjustedImages = [...images];
      if (!adjustedImages.some((i) => i.isMain) && adjustedImages.length > 0) {
        adjustedImages = adjustedImages.map((img, idx) => ({
          ...img,
          isMain: idx === 0,
        }));
      }

      //supabase 이미지 업로드
      const uploadedImages = [];
      let order = 1;

      for (const img of adjustedImages) {
        const imageUrl = await uploadToSupabase(img.file);

        uploadedImages.push({
          imageUrl,
          // sortOrder: img.sortOrder,
          sortOrder: order++,
          isMain: img.isMain,
        });
      }

      const finalLegalDongCode = form.location?.legalDongCode ?? null;
      console.log("최종 legalDongCode (10자리):", finalLegalDongCode);

      const payload = {
        ...form,
        sellingArea:
          form.direct && form.location ? form.location.locationName : null,
        // legalDongCode: form.location?.legalDongCode ?? null,
        legalDongCode: finalLegalDongCode,
        latitude: form.location?.latitude ?? null,
        longitude: form.location?.longitude ?? null,
        location: form.location,
        images: uploadedImages,

        aiCaption: vision?.caption?.trim() ? vision.caption.trim() : null,
        aiTags: JSON.stringify(Array.isArray(vision?.tags) ? vision.tags : []),
        environmentScore: form.environmentScore ?? null,
      };

      const response = await createProductApi(payload);

      window.removeEventListener("beforeunload", handleBeforeUnload); //새로고침 confirm감지 제거

      // if (response && response.productId) {
      if (response?.productId) {
        console.log("상품 등록 성공 응답 데이터:", response); // 응답 데이터 확인용
        alert(`상품 등록 완료! 상품ID: ${response.productId}`);
        navigate(`/products/${response.productId}`, { replace: true });
      } else {
        // 서버가 유효한 JSON 대신 null/비어있는 응답을 보냈을 때 처리
        console.error(
          "서버 응답 문제(예상된 productId를 찾을 수 없거나 응답이 null):",
          response
        );
        setError(
          "상품 등록은 완료되었을 수 있으나, 서버 응답 형식이 올바르지 않습니다."
        );
        // navigate("/products");
        return; // 에러시 화면이동X
      }
    } catch (error) {
      console.error(error);
      setError("상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitLoading(false);
    }
  }, [form, images, navigate]);

  // 자주 쓰는 문구 적용 핸들러
  const handleApplyPhrase = useCallback((text) => {
    setForm((prev) => ({
      ...prev,
      productDescription: prev.productDescription
        ? prev.productDescription + "\n" + text
        : text,
    }));
  }, []);

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
      <div className="max-w-full mx-auto bg-gray-0  -mb-4 ">
        <div className="px-6">
          <div className="border-b py-4">
            <span className="text-lg font-semibold pl-5">상품 정보</span>
          </div>

          {/* AI로 작성하기 - 2,3차 개발*/}
          <div>
            <AiWriteSection
              value={aiWriteEnabled}
              onChange={setAiWriteEnabled}
            />
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
              onOpenPhraseModal={() => setIsPhraseModalOpen(true)} // 자주 쓰는 문구 모달 열기
            />
          </div>

          {/*자주 쓰는 문구 모달: reloadPhrases(등록) */}
          <FrequentPhraseModal
            open={isPhraseModalOpen}
            onClose={() => setIsPhraseModalOpen(false)}
            phrases={phrases}
            setPhrases={setPhrases}
            onApplyPhrase={handleApplyPhrase}
            onReloadPhrases={reloadPhrases}
          />

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
              value={form}
              images={images}
              onChange={(next) => setForm((prev) => ({ ...prev, ...next }))}
            />
          </div>

          {/* Vision 브릿지 */}
          <ProductVisionBridge
            file={mainImage?.file}
            onLoading={handleVisionLoading}
            onResult={handleVisionResult}
            onError={handleVisionError}
            onReset={handleVisionReset}
          />

          {/* 환경 점수 - 2,3차 개발*/}
          <div>
            <EcoScoreSection score={form.environmentScore} />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0  bg-white border-t z-40 ">
          <ActionButtonBar
            role="WRITER"
            onSubmit={handleSubmit}
            loading={submitLoading}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductCreatePage;
