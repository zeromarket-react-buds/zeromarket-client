import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { CheckCircle, MapPin, ChevronUp, ChevronDown } from "lucide-react";

const PriceDetail = ({ sellPrice, feeRate = 0.036 }) => {
  const paymentFee = Math.max(0, Math.floor(sellPrice * feeRate));
  const totalAmount = sellPrice + paymentFee;

  return (
    <div className="border-t px-4 py-3 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">상품 금액</span>
        <span className="font-medium">{sellPrice.toLocaleString()}원</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">간편결제 수수료({(feeRate * 100).toFixed(1)}%)</span>
        <span className="text-gray-500">{paymentFee.toLocaleString()}원</span>
      </div>

      <div className="flex justify-between font-semibold text-green-700 pt-2">
        <span>최종 결제금액</span>
        <span>{totalAmount.toLocaleString()}원</span>
      </div>
    </div>
  );
};

const TradeOptionCard = ({ title, description, sub, icon, active, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer border rounded-lg p-4 transition ${
      active ? "border-green-700" : "border-gray-200"
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`mt-1 ${active ? "text-green-700" : "text-gray-400"}`}>{icon}</div>
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

  useEffect(() => {
    // 거래 방식 초기값이 없고 둘 다 가능한 경우 배송 거래를 기본 선택
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
      next.delete("addressId"); // 거래 방식이 바뀌면 주소는 초기화
      return next;
    });
  };

  const goPayment = () => {
    if (!tradeType) {
      alert("거래 방식을 선택해주세요.");
      return;
    }

    const search = searchParams.toString();
    navigate({
      pathname: "payment",
      search: search ? `?${search}` : "",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border p-4 space-y-4">
      {/* 거래 방식 */}
      {product.delivery && (
        <TradeOptionCard
          title="택배 거래"
          description="배송비 무료로 편하게 받아보세요."
          icon={<CheckCircle />}
          active={tradeType === "DELIVERY"}
          onClick={() => selectTradeType("DELIVERY")}
        />
      )}
      {product.direct && (
        <TradeOptionCard
          title="만나서 직거래"
          description="직접 만나 상품을 확인하고 거래해요."
          sub="판매자 위치 확인 가능"
          icon={<MapPin />}
          active={tradeType === "DIRECT"}
          onClick={() => selectTradeType("DIRECT")}
        />
      )}

      {/* 결제 요약 */}
      <div className="border rounded-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">최종 결제금액</span>
          <div className="cursor-pointer" onClick={() => setShowDetail((prev) => !prev)}>
            {showDetail ? <ChevronDown /> : <ChevronUp />}
          </div>
        </div>

        <div className="px-4 pb-3 flex justify-between text-sm font-semibold text-green-700">
          <span>{product.sellPrice.toLocaleString()}원</span>
        </div>

        {showDetail && <PriceDetail sellPrice={product.sellPrice} />}
      </div>

      {/* 구매 버튼 */}
      <button
        onClick={goPayment}
        className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg"
      >
        구매하기
      </button>
    </div>
  );
};

export default PurchasePanelPage;
