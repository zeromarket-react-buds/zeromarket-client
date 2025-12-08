import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";
import dayjs from "@/utils/time";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ products, onToggleLike }) => {
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast();

  const navigate = useNavigate();

  // // 찜 목록 추가/삭제 함수
  // const handleHeartClick = (productId, liked) => {
  //   if (!liked) showLikeAddedToast();
  //   else showLikeRemovedToast();

  //   onToggleLike(productId);
  // };

  // ⭐ 찜 목록 추가/삭제 함수 (백엔드 연동 버전)
  const handleHeartClick = async (productId, isWished) => {
    // ⭐ 백엔드 토글 API 호출 (onToggleLike가 fetch 실행함)
    const newState = await onToggleLike(productId); // true / false

    // ⭐ 토스트는 API 결과(newLiked)를 기준으로 실행해야 정확함
    if (newState) showLikeAddedToast();
    else showLikeRemovedToast();
  };

  // 상세 이동
  const goDetail = (id) => navigate(`/products/${id}`);

  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p) => (
        <div key={p.productId} onClick={() => goDetail(p.productId)}>
          <Card className="border-0 shadow-none w-full max-w-sm p-2">
            <CardHeader className="p-0">
              {/* 상품에 관한 이미지 부분 */}
              <div className="relative aspect-square overflow-hidden">
                {/* 상품 섬네일 */}
                <img
                  src={p.thumbnailUrl}
                  className="relative rounded-xl w-full h-full object-cover"
                />
                <div className="flex absolute justify-between items-center bottom-0 w-full px-4 py-3">
                  {p.salesStatus?.description === "예약중" ? (
                    <Badge>{p.salesStatus.description}</Badge>
                  ) : (
                    <div></div>
                  )}
                  {/* 찜하기 버튼 */}
                  <Heart
                    className="size-6 mx-1 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHeartClick(p.productId, p.isWished);
                    }}
                    fill={p.isWished ? "red" : "none"}
                    stroke={p.isWished ? "red" : "currentColor"}
                  />
                </div>
              </div>

              {/* 상품에 관한 상세정보 부분 */}
              <CardTitle className="line-clamp-1">{p.productTitle}</CardTitle>
              <CardTitle>{p.sellPrice?.toLocaleString()}원</CardTitle>
              <CardDescription>{dayjs(p.createdAt).fromNow()}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
