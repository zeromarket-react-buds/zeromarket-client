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
import { useAuth } from "@/hooks/AuthContext"; // 본인상품 찜방지 작업

//자식. 컴포넌트로 products, onToggleLike 전달받음
const ProductCard = ({ products, onToggleLikeInProductList }) => {
  const { showLikeAddedToast, showLikeRemovedToast } = useLikeToast();

  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();

  // // 찜 목록 추가/삭제 함수
  // const handleHeartClick = (productId, liked) => {
  //   if (!liked) showLikeAddedToast();
  //   else showLikeRemovedToast();

  //   onToggleLike(productId);
  // };

  // ⭐ 찜 목록 추가/삭제 함수 (백엔드 연동 버전)
  const handleHeartClick = async (clickedProductId) => {
    // ⭐ 백엔드 토글 API 호출 (onToggleLike가 fetch 실행함)
    const newState = await onToggleLikeInProductList(clickedProductId);
    // true/false 반환 토스트 출력, 부모함수 호출

    // ⭐ 토스트는 API 결과(newLiked)를 기준으로 실행해야 정확함
    if (newState) showLikeAddedToast();
    else showLikeRemovedToast();
  };

  // 상세 이동
  const goDetail = (id) => navigate(`/products/${id}`);
  //*map 돌면서 카드 렌더링. p는 product배열의 하나에 원소

  //*const [products, setProducts] = useState([]);
  //ㄴ>useState함수: products변수의 변화를 감지해서 렌더링해준다
  return (
    <div className="grid grid-cols-2 gap-6">
      {products.map((p) => {
        // 본인 상품 여부 판단
        const isMyProduct = isAuthenticated && p.sellerId === user?.memberId;

        // 자기찜방지 디버깅용 출력
        console.log("🧪자기찜 방지작업 디버깅", {
          productId: p.productId,
          sellerId: p.sellerId,
          loginMemberId: user?.memberId,
          isAuthenticated,
          isMyProduct,
        });

        return (
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

                    {/* 찜하기 버튼  1.productId*/}
                    {/* 본인 상품이면 하트 미노출 */}
                    {!isMyProduct && (
                      <Heart
                        className="size-6 mx-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHeartClick(p.productId);
                        }}
                        fill={p.isWished ? "red" : "none"}
                        stroke={p.isWished ? "red" : "currentColor"}
                      />
                    )}
                  </div>
                </div>

                {/* 상품에 관한 상세정보 부분 */}
                <CardTitle className="line-clamp-1">{p.productTitle}</CardTitle>
                <CardTitle>{p.sellPrice?.toLocaleString()}원</CardTitle>
                <CardDescription>
                  {dayjs(p.createdAt).fromNow()}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;
