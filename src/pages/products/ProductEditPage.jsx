import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useAuthHelper } from "@/hooks/useAuthHelper";
import {
  updateProductApi,
  getProductDetailApi,
} from "@/common/api/product.api";
import { useModal } from "@/hooks/useModal";
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
import ProductVisionBridge from "@/components/product/create/ProductVisionBridge";
import useProductVisionAi from "@/hooks/useProductVisionAi";
import FrequentPhraseModal from "@/components/common/FrequentPhraseModal";
import {
  getProductCustomTextsApi,
  createProductCustomTextApi,
  // updateProductCustomTextApi,
  // deleteProductCustomTextApi,
} from "@/common/api/customText.api";

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
  sellingArea: "",
  location: null,
  environmentScore: null,
  aiWriteEnabled: false,
};

//안전성위해 외부분리,한번만 생성
const handleBeforeUnload = (e) => {
  e.preventDefault();
  e.returnValue = "";
};

const ProductEditPage = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const routerLocation = useLocation();
  const { id } = useParams();
  const [pageLoading, setPageLoading] = useState(true); //읽기로딩
  const [submitLoading, setSubmitLoading] = useState(false); //등록로딩
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setHeader } = useHeader();
  const { ensureLogin } = useAuthHelper();
  const { alert, confirm } = useModal();

  //자주쓰는 문구 모달 open 상태
  const [isPhraseModalOpen, setIsPhraseModalOpen] = useState(false);

  //자주 쓰는 문구 목록 state
  const [phrases, setPhrases] = useState([]);

  // 자주 쓰는 문구 목록 조회 함수
  const reloadPhrases = useCallback(async () => {
    try {
      const data = await getProductCustomTextsApi({ contentType: "PRODUCT" }); // 서버에서 [{id,text}, ...]
      setPhrases(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("자주 쓰는 문구 조회 실패:", e);
      // UX 선택: 조용히 실패하거나 alert
      // alert("자주 쓰는 문구를 불러오지 못했습니다.");
    }
  }, []);

  // 자주쓰는 문구 모달 열릴 때 목록 로드
  useEffect(() => {
    if (isPhraseModalOpen) {
      reloadPhrases();
    }
  }, [isPhraseModalOpen, reloadPhrases]);

  // 문구를 상품설명 textarea에 “추가” 적용하는 함수
  const handleApplyPhrase = useCallback((text) => {
    setForm((prev) => ({
      ...prev,
      productDescription: prev.productDescription
        ? prev.productDescription + "\n" + text
        : text,
    }));
  }, []);

  // vision/aiDraft/mainImage 관련은 훅으로 이동
  const {
    mainImage,

    vision,
    visionLoading,
    visionError,

    aiWriteEnabled,
    setAiWriteEnabled,

    handleVisionResult,
    handleVisionReset,
    handleVisionLoading,
    handleVisionError,
  } = useProductVisionAi({ images, form, setForm });

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

        const hasSelectedLocation = !!routerLocation.state?.selectedLocation;

        //백에서 가져온 초기데이터로 폼채우기
        setForm((prev) => ({
          ...prev, // 현재 상태 유지 (지도를 다녀왔다면 이미 selectedLocation이 반영되어 있을 수 있음)
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
          location: hasSelectedLocation
            ? prev.location
            : data.locationDto
            ? { ...data.locationDto, locationName: data.sellingArea }
            : null,

          environmentScore:
            typeof data.environmentScore !== "undefined"
              ? data.environmentScore
              : null,
        }));

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
        await alert({ description: "상품 정보를 불러오는데에 실패했습니다." });
      } finally {
        setPageLoading(false);
      }
    };
    fetchDetail();
  }, [id, user, isAuthenticated, authLoading]);

  // 직거래 위치 선택 후 복귀 처리
  useEffect(() => {
    if (routerLocation.state?.selectedLocation) {
      const newLocation = routerLocation.state.selectedLocation;

      setForm((prev) => ({
        ...prev,
        location: newLocation,
        sellingArea: newLocation.locationName,
        direct: true,
      }));
      const timer = setTimeout(() => {
        navigate(routerLocation.pathname, { replace: true, state: {} });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [routerLocation.state, navigate, routerLocation.pathname]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  //상품 수정
  const handleSubmit = useCallback(
    async (e) => {
      if (e && e.preventDefault) e.preventDefault();

      if (!(await ensureLogin())) return;

      if (!form.productTitle.trim()) {
        await alert({ description: "상품명을 입력해주세요." });
        return;
      }

      if (!form.sellPrice) {
        await alert({ description: "판매 가격을 입력해주세요." });
        return;
      }

      if (!Number(form.categoryDepth3)) {
        await alert({ description: "카테고리를 선택해주세요." });
        return;
      }

      if (!form.delivery && !form.direct) {
        await alert({ description: "거래 방법을 1개 이상 선택해주세요." });
        return;
      }

      if (form.direct && !form.location) {
        await alert({ description: "직거래 위치를 선택해주세요." });
        return;
      }

      const isConfirmed = await confirm({
        description: "작성하신 정보로 상품을 수정하시겠습니까?",
      });
      if (!isConfirmed) return;

      setSubmitLoading(true);
      setError("");
      // console.log("상품 수정 요청 시작");

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
            const uploadedUrl = await uploadToSupabase(img.file);
            if (uploadedUrl) {
              url = uploadedUrl;
            }
          }
          if (!url) {
            console.error("이미지 URL을 찾을 수 없습니다:", img);
            continue;
          }
          if (url) {
            finalImages.push({
              imageId: img.imageId ?? null,
              imageUrl: url,
              sortOrder: order++,
              isMain: img.isMain,
            });
          }
        }

        const payload = {
          productTitle: form.productTitle,
          categoryDepth1: form.categoryDepth1,
          categoryDepth2: form.categoryDepth2,
          categoryDepth3: form.categoryDepth3,
          sellPrice: Number(form.sellPrice),
          productDescription: form.productDescription,
          productStatus: form.productStatus,
          direct: form.direct,
          delivery: form.delivery,
          sellingArea:
            form.direct && form.location
              ? form.location.locationName
              : form.sellingArea,

          // 백엔드 product_location 테이블 업데이트용 객체
          location:
            form.direct && form.location
              ? {
                  locationName: form.location.locationName,
                  legalDongCode: form.location.legalDongCode,
                  latitude: Number(form.location.latitude),
                  longitude: Number(form.location.longitude),
                  roadAddress: form.location.roadAddress,
                  jibunAddress: form.location.jibunAddress,
                  buildingName: form.location.buildingName,
                  zipCode: form.location.zipCode,
                }
              : null,
          images: finalImages,
          // environmentScore: form.environmentScore ,

          aiCaption: vision?.caption?.trim() ? vision.caption.trim() : null,
          aiTags: JSON.stringify(
            Array.isArray(vision?.tags) ? vision.tags : []
          ),
          environmentScore: form.environmentScore ?? null,
        };

        const response = await updateProductApi(id, payload);

        if (response && (response.ok || response.status === 200)) {
          window.removeEventListener("beforeunload", handleBeforeUnload);
          await alert({ description: "상품 수정이 완료되었습니다!" });
          navigate(`/products/${id}`, { replace: true });
        } else {
          await alert({ description: "상품 수정 실패" });
          console.error("서버 응답 문제:", response);
        }
      } catch (error) {
        console.error(error);
        await alert({
          description:
            "상품 수정 등록 중 오류가 발생했습니다.\n다시 시도해주세요.",
        });
      } finally {
        setSubmitLoading(false);
      }
    },
    [form, images, navigate, id, vision, alert, confirm, ensureLogin]
  );

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
    <div className="-mt-9">
      <Container>
        {submitLoading && <div>로딩중...</div>}

        <div className="max-w-full mx-auto bg-gray-0 -mb-4 ">
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
                // 자주 쓰는 문구 모달 열기 핸들러 연결
                onOpenPhraseModal={() => setIsPhraseModalOpen(true)}
              />
            </div>

            {/* 자주 쓰는 문구 모달 */}
            <FrequentPhraseModal
              open={isPhraseModalOpen}
              onClose={() => setIsPhraseModalOpen(false)}
              phrases={phrases}
              onApplyPhrase={handleApplyPhrase}
              onReloadPhrases={reloadPhrases}
              // 아래는 모달에서 "등록" API를 직접 쓰는 구조라면 넘겨줘도 되고,
              // 모달이 자체적으로 API 호출한다면 빼도 됨
              //onCreatePhrase={createProductCustomTextApi}
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
                isEdit={true}
                productId={id}
                routeState={routerLocation.state}
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
              <EcoScoreSection
                score={form.environmentScore}
                loading={visionLoading}
                error={visionError}
              />
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
    </div>
  );
};

export default ProductEditPage;
