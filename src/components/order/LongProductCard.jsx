import { Badge } from "@/components/ui/badge";

const LongProductCard = ({
  productTitle,
  sellPrice,
  tradeType,
  tradeStatus,
  thumbnailUrl,
}) => {
  return (
    <div className="flex flex-row gap-10 items-center">
      <div className="overflow-hidden">
        <img
          src={thumbnailUrl}
          className="n w-[140px] h-[100px] object-cover rounded-2xl"
        />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibold">{productTitle}</div>
        <div className="font-semibold">{sellPrice.toLocaleString()}원</div>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="text-brand-mediumgray">{tradeType}</div>
          <Badge>{tradeStatus}</Badge>
        </div>
      </div>
    </div>
  );
};

export default LongProductCard;
