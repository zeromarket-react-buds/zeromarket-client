import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const LongProductCard = ({
  productId,
  productTitle,
  sellPrice,
  tradeType,
  tradeStatus,
  thumbnailUrl,
}) => {
  const navigate = useNavigate();

  const goDetail = (e) => {
    e.stopPropagation();
    navigate(`/products/${productId}`);
  };
  return (
    <div className="flex flex-row gap-10 items-center">
      <div className="overflow-hidden">
        <img
          src={thumbnailUrl}
          className="n w-[140px] h-[100px] object-cover rounded-2xl"
          onClick={goDetail}
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibold">{productTitle}</div>
        <div className="font-semibold">{sellPrice.toLocaleString()}원</div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-brand-mediumgray">{tradeType}</div>
          {tradeStatus === "취소" ? (
            <Badge variant="red">구매취소</Badge>
          ) : (
            <Badge>{tradeStatus}</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default LongProductCard;
