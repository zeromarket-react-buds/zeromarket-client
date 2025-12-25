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

  //  찜 목록 추가/삭제 함수 (백엔드 연동 버전)
  const handleHeartClick = async (clickedProductId) => {
    //비로그인 가드 (API 호출 자체를 막음)
    if (!isAuthenticated) {
      alert("로그인이 필요합니다."); // 나중에 로그인 모달/토스트로 교체 가능
      return;
    }

    // 로그인 상태에서만 찜. 백엔드 토글 API 호출 (onToggleLikeInProductList 가 fetch 실행함)
    const newState = await onToggleLikeInProductList(clickedProductId);
    // true/false 반환 토스트 출력, 부모함수 호출

    // 토스트는 API 결과(newState)를 기준으로 출력
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
        const isHiddenStatus = p.hidden === true;

        return (
          <div key={p.productId} onClick={() => goDetail(p.productId)}>
            <Card className="border-0 shadow-none w-full max-w-sm p-2">
              <CardHeader className="p-0 cursor-pointer">
                {/* 상품에 관한 이미지 부분 */}
                <div className="relative aspect-square overflow-hidden">
                  {/* 상품 섬네일 */}
                  <img
                    src={p.thumbnailUrl}
                    className="relative rounded-xl w-full h-full object-cover "
                  />
                  <div className="flex absolute justify-between items-center bottom-0 w-full px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      {isHiddenStatus && <Badge variant="gray">숨김</Badge>}

                      {p.salesStatus?.description === "예약중" ? (
                        <Badge>{p.salesStatus.description}</Badge>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    {/* 찜하기 버튼  1.productId*/}
                    {/* 본인 상품이면 하트 미노출 */}
                    {!isMyProduct && (
                      <Heart
                        className="size-6 mx-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); //상세이동 방지
                          handleHeartClick(p.productId); //로그인가드
                        }}
                        fill={p.liked ? "red" : "none"}
                        stroke={p.liked ? "red" : "currentColor"}
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
