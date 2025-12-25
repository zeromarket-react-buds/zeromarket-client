import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { CheckCircle, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { useModal } from "@/hooks/useModal";

const PriceDetail = ({
  sellPrice,
  paymentFee,
  totalAmount,
  feeRate = 0.036,
}) => (
  <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
    <div className="px-4 py-3 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">상품 금액</span>
        <span className="font-medium">{sellPrice.toLocaleString()}원</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-400 line-through">
          안심 결제 수수료 ({(feeRate * 100).toFixed(1)}%)
        </span>
        <span className="text-gray-400 line-through">
          {paymentFee.toLocaleString()}원
        </span>
      </div>

      <div className="flex justify-between font-semibold text-green-700 pt-2">
        <span>예상 결제 금액</span>
        <span>{totalAmount.toLocaleString()}원</span>
      </div>
    </div>
  </div>
);

const TradeOptionCard = ({
  title,
  description,
  sub,
  icon,
  active,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer border rounded-lg p-4 transition ${
      active ? "border-green-700 shadow-sm" : "border-gray-200"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-1 ${active ? "text-green-700" : "text-gray-400"}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
        {sub && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
            <MapPin size={14} />
            {sub}
          </div>
        )}
      </div>
    </div>
  </div>
);

const PurchasePanelPage = () => {
  const navigate = useNavigate();
  const { product } = useOutletContext();

  const [showDetail, setShowDetail] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const tradeType = searchParams.get("tradeType"); // DELIVERY | DIRECT

  const feeRate = 0.036;
  const paymentFee = Math.max(0, Math.floor(product.sellPrice * feeRate));
  const totalAmount = product.sellPrice; // 수수료 미반영 (상품 금액만)

  const { alert } = useModal();

  useEffect(() => {
    if (!tradeType) {
      if (product.delivery) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("tradeType", "DELIVERY");
          return next;
        });
      } else if (product.direct) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("tradeType", "DIRECT");
          return next;
        });
      }
    }
  }, [product.delivery, product.direct, setSearchParams, tradeType]);

  const selectTradeType = (type) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tradeType", type);
      next.delete("addressId"); // 거래 방식 변경 시 배송지 초기화
      return next;
    });
  };

  const goPayment = async () => {
    if (!tradeType) {
      await alert({ description: "거래 방식을 선택해주세요." });
      return;
    }

    const search = searchParams.toString();
    navigate({
      pathname: "payment",
      search: search ? `?${search}` : "",
    });
  };

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="max-w-md mx-auto p-4 space-y-4 pb-44">
        {/* 거래 방식 선택 */}
        {product.delivery && (
          <TradeOptionCard
            title="택배 거래"
            description="배송비 무료 상품입니다."
            icon={<CheckCircle />}
            active={tradeType === "DELIVERY"}
            onClick={() => selectTradeType("DELIVERY")}
          />
        )}
        {product.direct && (
          <TradeOptionCard
            title="만나서 직거래"
            description="상품을 직접 받을 수 있어요"
            sub={
              product.sellingArea ||
              product.location?.locationName ||
              "만남 장소를 협의해주세요"
            }
            icon={<MapPin />}
            active={tradeType === "DIRECT"}
            onClick={() => selectTradeType("DIRECT")}
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-10">
        <div className="max-w-md mx-auto px-4 py-3 space-y-3">
          {showDetail && (
            <PriceDetail
              sellPrice={product.sellPrice}
              paymentFee={paymentFee}
              totalAmount={totalAmount}
              feeRate={feeRate}
            />
          )}

          <div className="flex items-center justify-between text-sm font-semibold">
            <span>
              예상 결제금액{" "}
              <span className="text-green-700">
                {totalAmount.toLocaleString()}원
              </span>
            </span>
            <button
              type="button"
              className="p-1 cursor-pointer"
              onClick={() => setShowDetail((prev) => !prev)}
              aria-label="결제 금액 상세 보기"
            >
              {showDetail ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          <button
            onClick={goPayment}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"
          >
            구매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchasePanelPage;
