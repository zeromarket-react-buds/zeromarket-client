import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import {
  getProductDetailApi,
  getSimilarProductsApi,
} from "@/common/api/product.api";

import Container from "@/components/Container";
import ActionButtonBar from "@/components/product/ActionButtonBar";

import ProductSellerInfo from "@/components/product/detail/ProductSellerInfo";
import DetailTitlePriceSection from "@/components/product/detail/DetailTitlePriceSection";
import ProductTradeInfoSection from "@/components/product/detail/ProductTradeInfoSection";
import ProductCategoryTimeSection from "@/components/product/detail/ProductCategoryTimeSection";
import DetailEcoScoreSection from "@/components/product/detail/DetailEcoScoreSection";
import SimilarProductsSection from "@/components/product/detail/SimilarProductsSection";
import ProductImageCarousel from "@/components/product/detail/ProductImageCarousel";
import { products } from "@/data/product.js";

const ProductDetailPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const { onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const [similarProducts, setSimilarProducts] = useState([]);

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

  const fetchProductDetail = async () => {
    try {
      const data = await getProductDetailApi(id);

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
        setDetail({
          productId: id,
          images: [],
          seller: {},
          isHidden: true,
          sellerId: user.memberId,
        });
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

  const toggleWish = async () => {
    try {
      const method = detail.isWished ? "DELETE" : "POST";

      const res = await fetch(`http://localhost:8080/api/products/${id}/wish`, {
        method,
      });

      if (!res.ok) throw new Error("찜 토글 실패");

      const result = await res.json();
      console.log("🔥 서버 응답:", result);

      if (method === "POST") {
        navigate("/me/wishlist");
      }

      setDetail((prev) => ({
        ...prev,
        isWished: result,
        wishCount: result ? prev.wishCount + 1 : prev.wishCount - 1,
      }));
    } catch (err) {
      console.error("찜 토글 실패 : ", err);
    }
  };

  useEffect(() => {
    fetchProductDetail();
    fetchSimilarProducts();
  }, [id]);

  useEffect(() => {
    if (detail) {
      console.log("🔥 상세상품 detail:", detail);
      console.log("🔥 salesStatus:", detail.salesStatus);
      console.log("🔥 isWished:", detail.isWished);
      console.log("🔥 wishCount:", detail.wishCount);
    }
  }, [detail]);

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
  const isProductHidden =
    detail.isHidden || detail.productStatus?.name === "HIDDEN";

  const handleStatusUpdateSuccess = () => {
    fetchProductDetail();
  };

  return (
    <div>
      <Container>
        <div className="max-w-full mx-auto bg-gray-0 ">
          <div>
            {/* 상품 이미지 */}
            <ProductImageCarousel images={sortedImages} />
          </div>
          <div className="px-6">
            {/* 판매자 정보 확인*/}
            <ProductSellerInfo detail={detail} />

            {/* 상품명 & 가격 & 판매상태*/}
            <DetailTitlePriceSection detail={detail} />

            {/* 카테고리 + n시간전 */}
            <ProductCategoryTimeSection detail={detail} />

            {/* 상품상태 */}
            <div className="flex justify-between items-center my-5 w-full border rounded-lg px-3 py-2 text-sm">
              <span>상품상태</span>
              <span>{detail.productStatus?.description}</span>
            </div>

            {/* 설명 */}
            <div className="mb-4">
              <div className=" font-semibold mb-2">설명</div>
              <p className="">{detail.productDescription}</p>
            </div>

            {/* 환경점수 - 2,3차 */}
            <DetailEcoScoreSection detail={detail} />

            {/* 거래 정보 */}
            <ProductTradeInfoSection detail={detail} />

            {/* 신고하기 버튼 */}
            <div className="mb-6">
              <button>신고하기</button>
            </div>

            {/* 비슷한 상품 */}
            <SimilarProductsSection
              products={similarProducts}
              onToggleLike={onToggleLike}
            />
          </div>

          {/* 로그인 여부와 상품 작성자 여부 따라 버튼 다르게 렌더링 */}
          <div className="sticky bottom-0 bg-white border-t z-50">
            <ActionButtonBar
              role={isAuthenticated && isProductOwner ? "SELLER" : "BUYER"}
              isWished={detail.isWished}
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
