import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// 거래 타입 표시용 문자열 생성
const buildTradeTypeLabel = ({ tradeType, isDirect, isDelivery }) => {
  // tradeType enum 객체가 있으면 description 우선 사용
  if (tradeType && tradeType.description) {
    return tradeType.description;
  }

  // tradeType enum이 없으면 isDirect / isDelivery로 판단 (거래상품x, 숨기기상품 같은 것)
  const direct = isDirect === true;
  const delivery = isDelivery === true;

  if (direct && delivery) return "직거래 / 택배거래";
  if (direct) return "직거래";
  if (delivery) return "택배거래";

  // 둘 다 없으면 표시 안 함 (방어용 코드)
  return "";
};

const LongProductCard = ({
  productId,
  productTitle,
  sellPrice,
  tradeType, // enum 객체({ name, description }) 또는 라벨 문자열. 없을 수도 있음
  isDirect, // tradeType 없을시 체크할 Boolean
  isDelivery, // tradeType 없을시 체크할 Boolean
  tradeStatus, // enum 형태는 아니고 enum의 .description 부분 그대로
  thumbnailUrl,
  isHidden,
}) => {
  const tradeTypeLabel = buildTradeTypeLabel({
    tradeType,
    isDirect,
    isDelivery,
  });

  return (
    <div className="flex flex-row gap-10 items-center">
      <div className="overflow-hidden">
        <Link to={`/products/${productId}`}>
          <img
            src={thumbnailUrl}
            className="w-[140px] h-[100px] object-cover rounded-2xl"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibold line-clamp-1">{productTitle}</div>
        <div className="font-semibold">{sellPrice?.toLocaleString()}원</div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-brand-mediumgray">{tradeTypeLabel}</div>
          {isHidden ? (
            <Badge>숨기기</Badge>
          ) : tradeStatus === "취소" ? (
            <Badge variant="red">거래취소</Badge>
          ) : tradeStatus ? (
            <Badge>{tradeStatus}</Badge>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LongProductCard;
