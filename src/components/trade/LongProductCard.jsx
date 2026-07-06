import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const LongProductCard = ({
  productId,
  productTitle,
  sellPrice,
  tradeType, // enum 객체({ name, description }) 또는 라벨 문자열. 없을 수도 있음
  tradeStatus, // enum 형태는 아니고 enum의 .description 부분 그대로
  thumbnailUrl,
  isHidden,
}) => {
  // 거래 타입 표시용 문자열 생성
  const tradeTypeLabel =
    tradeType?.description ??
    (tradeType?.name === "DELIVERY"
      ? "택배거래"
      : tradeType?.name === "DIRECT"
        ? "직거래"
        : "");

  return (
    <div className="flex flex-row gap-10 items-center">
      <div className="relative overflow-hidden shrink-0">
        <Link
          to={`/products/${productId}`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={thumbnailUrl}
            className="w-[140px] h-[100px] object-cover rounded-2xl"
          />
        </Link>

        {/* 모바일에서만 표시 */}
        {tradeStatus && (
          <div className="absolute left-2.5 bottom-2.5 md:hidden">
            {isHidden ? (
              <Badge>숨김</Badge>
            ) : tradeStatus === "취소" ? (
              <Badge variant="red">거래취소</Badge>
            ) : tradeStatus ? (
              <Badge>{tradeStatus}</Badge>
            ) : null}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibold line-clamp-1">{productTitle}</div>
        <div className="font-semibold">{sellPrice?.toLocaleString()}원</div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-brand-mediumgray">{tradeTypeLabel}</div>

          <div className="hidden md:block">
            {isHidden ? (
              <Badge>숨김</Badge>
            ) : tradeStatus === "취소" ? (
              <Badge variant="red">거래취소</Badge>
            ) : tradeStatus ? (
              <Badge>{tradeStatus}</Badge>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongProductCard;
