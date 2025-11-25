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
const ProductCard = ({ products, onToggleLike }) => {
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast();

  // 찜 목록 추가/삭제 함수
  const handleHeartClick = (productId, liked) => {
    if (!liked) showLikeAddedToast();
    else showLikeRemovedToast();

    onToggleLike(productId);
  };
  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p) => (
        <div key={p.productId}>
          <Card className="border-0 shadow-none w-full max-w-sm p-2">
            <CardHeader className="p-0">
              {/* 상품에 관한 이미지 부분 */}
              <div className="relative">
                {/* 상품 섬네일 */}
                <img
                  src={p.thumbnailUrl}
                  className="relative w-[250px] h-[250px] rounded-xl"
                />
                <div className="flex absolute justify-between items-center bottom-0 w-full px-4 py-3">
                  {/* 상품상태  */}
                  {p.salesStatus === "RESERVED" ? (
                    <Badge>예약중</Badge>
                  ) : (
                    <div></div>
                  )}
                  {/* 찜하기 버튼 */}
                  <Heart
                    className="size-6 mx-1 cursor-pointer"
                    onClick={() => handleHeartClick(p.productId, p.liked)}
                    fill={p.liked ? "red" : "none"}
                    stroke={p.liked ? "red" : "currentColor"}
                  />
                </div>
              </div>

              {/* 상품에 관한 상세정보 부분 */}
              <CardTitle>{p.productTitle}</CardTitle>
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
