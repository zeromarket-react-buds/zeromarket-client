import Container from "@/components/Container";
import { UserRound, Heart, Eye, Smile } from "lucide-react";
import ActionButtonBar from "@/components/product/ActionButtonBar";
import { products } from "@/data/product.js";
import ProductCard from "@/components/display/ProductCard";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLikeToggle } from "@/hooks/useLikeToggle";

const ProductDetailPage = () => {
  const { onToggleLike } = useLikeToggle([]);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);

  const formattedProducts = products.map((p) => ({
    productId: p.product_id,
    productTitle: p.product_title,
    sellPrice: p.sell_price,
    thumbnailUrl: p.thumbnail_url,
    createdAt: p.created_at,
    salesStatus: p.sales_status,
    liked: false,
  }));

  // fetch 요청
  const fetchProductDetail = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`);

      if (!res.ok) {
        const text = await res.text();
        console.log("상품 정보를 가져오지 못함", text);
        return;
      }

      const data = await res.json();
      setDetail(data);
    } catch (err) {
      setError(err.message);
      console.error("상품 상세 페이지 불러오기 실패 : ", err);
    } finally {
      setLoading(false);
    }
  };

  //찜수
  const fetchWishCount = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/products/${id}/wish-count`
      );

      if (!res.ok) return;

      const data = await res.json(); // { productId, wishCount }
      setDetail((prev) =>
        prev ? { ...prev, wishCount: data.wishCount } : prev
      );
    } catch (err) {
      console.error("찜 수 조회 실패:", err);
    }
  };

  //조회수
  const increaseViewCount = async () => {
    await fetch(`http://localhost:8080/api/products/${id}/view`, {
      method: "PATCH",
    });
  };

  const toggleWish = async () => {
    try {
      const method = detail.isWished ? "DELETE" : "POST";

      await fetch(`http://localhost:8080/api/products/${id}/wish`, {
        method,
      });

      setDetail((prev) => ({
        ...prev,
        isWished: !prev.isWished,
        wishCount: prev.isWished ? prev.wishCount - 1 : prev.wishCount + 1,
      }));
    } catch (err) {
      console.error("찜 토글 실패 : ", err);
    }
  };

  //초기로딩
  useEffect(() => {
    fetchProductDetail();
    increaseViewCount();
    fetchWishCount();
  }, [id]);

  if (loading) return <div>상품 상세 페이지 불러오는 중...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!detail) return <div>데이터 없음</div>;

  // 이미지 배열
  const images = detail.images || [];
  // const mainImage = images[currentIndex]?.imageUrl;
  return (
    <div>
      <Container>
        {/* <div>상품상세페이지입니다</div> */}
        <div className="max-w-full mx-auto bg-gray-0 ">
          <div className="relative">
            {/* 사진 영역 */}
            <div className="bg-gray-200 w-full h-90 flex items-center justify-center text-gray-600">
              {detail.images?.map((img) => (
                <img
                  key={img.imageId}
                  src={img.imageUrl}
                  className="object-cover w-full h-full"
                />
              ))}
              {/* 사진 */}
            </div>
            <div className="absolute bottom-2 right-2 m-5 font-">
              <span>{/* {detail.mainImageIndex + 1}  */}</span>{" "}
              <span>1/ 5</span>
            </div>
          </div>
          <div className="px-6">
            {/* 사진 아래영역 */}
            <div className="max-w-lg mx-auto py-5 bg-white">
              {/* 닉네임과 관련 정보 */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3 ">
                  <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-brand-ivory font-semibold">
                    <UserRound className="size-15" />
                  </div>
                  <span className="font-semibold text-brand-green text-2xl">
                    {/* 닉네임 */}
                    {detail.seller?.sellerNickName}
                  </span>
                </div>

                {/* 상호작용*/}
                <div className="flex items-center gap-5 px-1">
                  {/* 조회수 */}
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-brand-green">
                      {/* 12 */}
                      {detail.viewCount}
                    </span>
                    <span className="text-sm text-brand-mediumgray">
                      <Eye className="size-4" />
                    </span>
                  </div>

                  {/* 관심수 */}
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-brand-green">
                      5{detail.wishCount}
                    </span>
                    <span className="text-sm  text-brand-mediumgray">
                      <Heart className="size-4" />
                    </span>
                  </div>

                  {/* 신뢰점수 :) */}
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold text-brand-green">
                      5
                    </span>
                    <span className=" text-brand-mediumgray">
                      <Smile className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 상품명 */}

            <div className="text-2xl font-bold mb-2 ">
              {/* 상품명 */}
              {detail.productTitle}
            </div>

            {/* 가격 & 판매상태 */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-bold text-brand-green">
                {/* 예약중 */}
                {detail.salesStatus?.description}
              </span>
              <span className="text-lg font-semibold">
                {detail.sellPrice}원
              </span>
            </div>

            {/* 카테고리 + n시간전 */}
            <div className="flex justify-between items-center my-3">
              <span className=" text-gray-600 text-base hover:underline flex items-center">
                <span>{detail.categoryDepth1} </span>
                <span className="text- font-semibold">&nbsp;〉</span>
                <span>{detail.categoryDepth2}</span>
                <span className="text- font-semibold">&nbsp;〉</span>
                <span>{detail.categoryDepth3}</span>
              </span>

              <span className="text-sm text-gray-500">3시간 전</span>
            </div>

            {/* 상품상태 */}
            <div className="flex justify-between items-center my-5 w-full border rounded-lg px-3 py-2 text-sm">
              <span>상품상태</span>
              <span>{detail.productStatusKr}</span>
            </div>

            {/* 설명 */}
            <div className="mb-4">
              <div className=" font-semibold mb-2">설명</div>
              <p className="">{detail.productDescription}</p>
            </div>
            {/* 환경점수 - 2,3차 */}
            <div>
              <div className="flex items-center justify-between border-t py-3 ">
                <span className="">환경점수</span>
                <span className="text-brand-green text-2xl font-extrabold flex gap-3">
                  <span>+</span>
                  <span>50p</span>
                </span>
              </div>

              <div className=" my-2 text-sm text-brand-darkgray border-b pb-3">
                <div>환경을 생각하는 0000님, </div>
                <div> 이 물품을 구입하면 30mg 탄소절감이 됩니다! </div>
              </div>
            </div>
            {/* 거래 정보 */}
            <div className=" my-5 text-sm text-brand-darkgray ">
              <div className="flex justify-between mb-4">
                <span>거래방법</span>
                {/* <div>
                <span>직거래</span> | <span>택배거래 가능</span>
              </div> */}
                <div>
                  {detail.direct && <span>직거래</span>}
                  {detail.delivery && <span> | 택배거래 가능</span>}
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <span>거래위치</span>
                <span>{detail.sellingArea}</span>
              </div>
              {/* 맵(2차-직거래만 노출) */}
              <div className="bg-gray-200 w-full h-70 flex items-center justify-center text-gray-600">
                맵
              </div>
            </div>
            {/* 신고하기 버튼 */}
            <div className="mb-6">
              <button>신고하기</button>
            </div>

            {/* 비슷한 상품 */}
            <div>
              <div className="mb-20">
                <h3 className="text-lg font-semibold text-gray-800 my-3">
                  비슷한 물품
                </h3>

                {/* <div className="grid grid-cols-2 gap-1">
                {products.map((p) => (
                  <SimilarProductCard key={p.id} />
                ))}
              </div> */}
                <ProductCard
                  products={formattedProducts}
                  onToggleLike={onToggleLike}
                />
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white border-t z-50">
            <ActionButtonBar
              role="BUYER"
              // role={userRole}
              isWished={detail.isWished}
              onToggleWish={toggleWish}
            />
            {/* <div className="fixed bottom-0 w-xl bg-white border-t z-50">
            <ActionButtonBar
              role="BUYER"
              // role={userRole}
              isWished={detail.isWished}
              onToggleWish={toggleWish}
            /> */}
            {/* <ActionButtonBar
          role="SELLER"
          // role={userRole}
          productId={detail.productId}
        /> */}
          </div>
        </div>
      </Container>
    </div>
  );
};
export default ProductDetailPage;
