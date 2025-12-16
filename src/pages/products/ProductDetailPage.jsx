import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useLikeToggle } from "@/hooks/useLikeToggle"; //상세찜
import {
  getProductDetailApi,
  getSimilarProductsApi,
} from "@/common/api/product.api";
import { createReportApi } from "@/common/api/report.api";

import Container from "@/components/Container";
import ActionButtonBar from "@/components/product/ActionButtonBar";
import ProductSellerInfo from "@/components/product/detail/ProductSellerInfo";
import DetailTitlePriceSection from "@/components/product/detail/DetailTitlePriceSection";
import ProductTradeInfoSection from "@/components/product/detail/ProductTradeInfoSection";
import ProductCategoryTimeSection from "@/components/product/detail/ProductCategoryTimeSection";
import DetailEcoScoreSection from "@/components/product/detail/DetailEcoScoreSection";
import SimilarProductsSection from "@/components/product/detail/SimilarProductsSection";
import ProductImageCarousel from "@/components/product/detail/ProductImageCarousel";
import ProductDescriptionSection from "@/components/product/detail/ProductDescriptionSection";
import ProductStatusSection from "@/components/product/detail/ProductStatusSection";
import ReportModal from "@/components/report/ReportModal";

import { products } from "@/data/product.js";
import { useHeader } from "@/hooks/HeaderContext";
import AuthStatusIcon from "@/components/AuthStatusIcon";
import { Heart } from "lucide-react"; //찜 데이터 콘솔 확인용

const ProductDetailPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  //const { onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const { setHeader } = useHeader();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { onToggleLikeDetail } = useLikeToggle(); //상세 페이지용 onToggleLikeDetail 가져오기

  if (user === undefined) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        인증 상태 확인 중...
      </div>
    );
  }
  //목데이터
  // const formattedProducts = products.map((p) => ({
  //   productId: p.product_id,
  //   productTitle: p.product_title,
  //   sellPrice: p.sell_price,
  //   thumbnailUrl: p.thumbnail_url,
  //   createdAt: p.created_at,
  //   salesStatus: p.sales_status,
  //   liked: false,
  // }));

  /** ⭐ 수정됨: apiClient 기반으로 상세조회 */
  const fetchProductDetail = async () => {
    try {
      // TODO: memberId 여기서 안넣고 서버에서 해결해도 됨..
      const data = await getProductDetailApi(id, user?.memberId); //user?.memberId 전달

      console.log("🟢 서버에서 받은 상세 응답:", data);
      console.log("🟢 서버 wished:", data.wished, "wishCount:", data.wishCount);

      if (!data || typeof data !== "object") {
        setError("상품 정보를 불러오지 못했습니다.");
        return;
      }

      setDetail(data);
    } catch (err) {
      const status = err.status;
      if (status === 403) {
        setError("HIDDEN");
        alert("숨겨진 게시글입니다.");
        navigate(-1);
        return;
      }
      if (status === 404 || status === 410) {
        setError("상품이 삭제되었거나 존재하지 않습니다.");
        return;
      }
      setError("상품 정보를 불러오는 중 오류가 발생했습니다.");
      console.error("상품 상세 페이지 불러오기 실패 : ", err);
    } finally {
      setLoading(false);
    }
  };

  //비슷상품
  const fetchSimilarProducts = async () => {
    try {
      const data = await getSimilarProductsApi(id);

      if (!Array.isArray(data)) {
        console.warn("비슷한 상품 API 응답이 배열이 아님:", data);
        return;
      }

      const formatted = data.map((p) => ({
        productId: p.productId,
        productTitle: p.productTitle,
        sellPrice: p.sellPrice,
        thumbnailUrl: p.thumbnailUrl,
        createdAt: p.createdAt,
        salesStatus: p.salesStatus,
        liked: false,
      }));

      setSimilarProducts(formatted);
    } catch (err) {
      console.error("비슷한 상품 불러오기 실패:", err);
    }
  };

  //⭐ 찜 추가/삭제 (apiClient + onToggleLikeDetail 사용)
  const toggleWish = async () => {
    if (!detail) return; // 안전장치 추가
    try {
      // ⭐ apiClient 기반 찜 토글 함수 호출
      // ⭐ onToggleLikeDetail → 서버에서 true/false 반환
      const newState = await onToggleLikeDetail(detail.productId); // true/false
      // 서버가 반환한 newState
      console.log("*** 토글 후 받은 newState:", newState);

      // // ⭐ 업데이트된 detail을 계산
      // const method = detail.wished ? "DELETE" : "POST";
      // console.log("*** 실행될 HTTP method:", method);
      // console.log("*** 현재 wishCount:", detail?.wishCount);

      // const res = await fetch(`http://localhost:8080/api/products/${id}/wish`, {
      //   method,
      // });

      // if (!res.ok) throw new Error("찜 토글 실패");

      // const result = await res.json(); //서버응답 콘솔확인용
      // console.log("🔥 서버 응답:", result);

      // const isAdded = method === "POST";

      // // ⭐ 업데이트된 detail을 계산
      // const updated = {
      //   ...detail,
      //   wished: isAdded,
      //   wishCount: isAdded
      //     ? detail.wishCount + 1
      //     : Math.max((detail.wishCount || 1) - 1, 0),
      // };

      // // ⭐ 상태 반영
      // setDetail(updated);
      // console.log("🟡 토글 이후 detail 업데이트됨:", updated);

      // return isAdded; // ActionButtonBar에서 메시지 구분용

      // wishCount 계산
      const newWishCount = newState
        ? (detail.wishCount || 0) + 1
        : Math.max((detail.wishCount || 1) - 1, 0);

      // ⭐ detail 상태 업데이트
      setDetail((prev) => ({
        ...prev,
        wished: newState,
        wishCount: newWishCount,
      }));

      return newState;
    } catch (err) {
      console.error("찜 토글 실패 : ", err);
    }
  };

  useEffect(() => {
    // 1) AuthContext 로딩 중이면 실행 금지
    // if (!user) return; // Context 초기 상태일 때는 아무것도 안 함

    // 2) 로그인 여부가 결정될 때까지 기다림 (user === null이면 요청 금지)
    // if (user === null) return;
    const memberId = user ? user.memberId : null; // 로그인 여부 상관없이 처리

    fetchProductDetail(memberId);
    fetchSimilarProducts();
  }, [id, user]);

  useEffect(() => {
    if (detail) {
      console.log("🔥 상세상품 detail:", detail);
      console.log("🔥 salesStatus:", detail.salesStatus);
      console.log("🔥 wished:", detail.wished);
      console.log("🔥 wishCount:", detail.wishCount);

      console.log("💛 현재 detail.wished 값:", detail.wished);
      console.log("💛 현재 wishCount 값:", detail.wishCount);
    }
  }, [detail]);

  const handleShare = useCallback(async () => {
    // const { headerState } = useHeader();
    // const detail = headerState?.detail;
    if (navigator.share) {
      try {
        await navigator.share({
          title: detail?.productTitle || "제로마켓 상품",
          text: detail?.productDescription || "제로마켓 상품을 확인해보세요!",
          // title: "제로마켓 상품",
          // text: "제로마켓 상품을 확인해보세요!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("공유 실패:", err);
      }
    } else {
      // navigator.share 미지원시 > URL 클립보드 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("URL이 클립보드에 복사되었습니다!");
      } catch (err) {
        console.error("클립보드 복사 실패함:", err);
        alert("공유 기능을 사용할 수 없습니다.");
      }
    }
  }, [detail]);

  useEffect(() => {
    setHeader({
      title: "",
      showBack: true,
      rightActions: [
        {
          key: "share",
          label: "공유하기",
          onClick: handleShare,
          className: "font-semibold text-sm cursor-pointer",
        },
        <AuthStatusIcon
          isAuthenticated={isAuthenticated}
          navigate={navigate}
        />,
      ],
    });
  }, [handleShare]);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white text-gray-700 text-lg">
        상품 상세 페이지 불러오는 중...
      </div>
    );
  if (error && error !== "HIDDEN")
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white text-gray-700 text-lg">
        Error: {error}
      </div>
    );
  if (!detail)
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white text-gray-700 text-lg">
        데이터 없음
      </div>
    );

  //상품이미지 정렬
  const sortedImages = Array.isArray(detail.images)
    ? [...detail.images].sort((a, b) => {
        const aMain = Boolean(a.main);
        const bMain = Boolean(b.main);

        if (aMain && !bMain) return -1;
        if (!aMain && bMain) return 1;

        return a.sortOrder - b.sortOrder;
      })
    : [];

  const isProductOwner = user && user.memberId === detail.sellerId;
  const isProductHidden = detail.hidden;

  const handleStatusUpdateSuccess = () => {
    const memberId = user ? user.memberId : null;
    fetchProductDetail(memberId); // ⭐ 숨김/해제 후 상세 재조회
  };

  //신고하기
  const handleOpenReportModal = () => {
    if (!isAuthenticated) {
      const goLogin = window.confirm(
        "신고 기능은 로그인 후 이용 가능합니다. 로그인 화면으로 이동하시겠습니까?"
      );
      if (goLogin) {
        navigate("/login");
      }
      return;
    }
    setIsReportModalOpen(true);
    console.log("모달오픈");
  };
  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  //신고제출
  const handleSubmitReport = async ({ reasonId, reasonText }) => {
    if (!detail) return;

    const payload = {
      reasonId,
      targetType: "PRODUCT",
      targetId: detail.productId,
      reasonText: reasonText || null,
    };

    try {
      const result = await createReportApi(payload);
      alert(result?.message || "신고가 접수되었습니다.");

      setIsReportModalOpen(false);
    } catch (error) {
      console.error("신고 제출 실패", error);
      alert("신고 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div>
      <Container>
        <div className="relative">
          <div>
            {/* 상품 이미지 */}
            <ProductImageCarousel images={sortedImages} />
            {/*detail.wished, wishCount값 들어오는지 ui,콘솔 확인용*/}
            {/* {detail && (
              <Heart
                className="absolute top-4 right-4 size-8 cursor-pointer z-20"
                onClick={toggleWish}
                fill={detail.wished ? "red" : "none"}
                stroke={detail.wished ? "red" : "currentColor"}
              />
            )} */}
          </div>
          <div className="px-6">
            {/* 판매자 정보*/}
            <ProductSellerInfo detail={detail} />
            {/* 상품명 & 가격 & 판매상태*/}
            <DetailTitlePriceSection detail={detail} />
            {/* 카테고리 + n시간전 */}
            <ProductCategoryTimeSection detail={detail} />
            {/* 상품상태 */}
            <ProductStatusSection status={detail.productStatus} />
            {/* 상품설명 */}
            <ProductDescriptionSection
              description={detail.productDescription}
            />
            {/* 환경점수 - 2,3차 */}
            <DetailEcoScoreSection detail={detail} />
            {/* 거래 정보 + 맵 */}

            <ProductTradeInfoSection detail={detail} />

            {/* 신고하기 버튼 */}
            <div className="mb-4 mt-6 text-sm">
              <button
                className="cursor-pointer"
                onClick={handleOpenReportModal}
              >
                신고하기
              </button>
            </div>
            {/* 신고하기 모달 */}
            <ReportModal
              isOpen={isReportModalOpen}
              onclose={handleCloseReportModal}
              onSubmit={handleSubmitReport}
              targetType="PRODUCT"
            />
            {/* 비슷한 상품 */}
            <SimilarProductsSection
              products={similarProducts}
              onToggleLike={onToggleLikeDetail} //onToggleLike 에서 변경. 상세찜 함수 전달
            />
          </div>

          {/* 로그인 여부와 상품 작성자 여부 따라 버튼 다르게 렌더링 */}
          <div className="sticky bottom-0 bg-white border-t z-20">
            <ActionButtonBar
              role={isAuthenticated && isProductOwner ? "SELLER" : "BUYER"}
              wished={detail.wished}
              onToggleWish={toggleWish}
              productId={detail.productId}
              isHidden={isProductHidden}
              onHide={handleStatusUpdateSuccess}
              onUnhide={handleStatusUpdateSuccess}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailPage;
