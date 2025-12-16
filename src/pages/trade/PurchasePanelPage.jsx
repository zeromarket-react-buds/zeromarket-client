import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin, ChevronUp, ChevronDown } from "lucide-react";

const PriceDetail = () => {
  return (
    <div className="border-t px-4 py-3 space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-500">상품 금액</span>
        <span className="font-medium">500원</span>
      </div>

      <div className="flex justify-between">
        <span className="text-gray-500">안심 결제 수수료 3.6%</span>
        <span className="text-gray-400 line-through">24원</span>
      </div>

      <div className="flex justify-between font-semibold text-green-700 pt-2">
        <span>예상 결제금액</span>
        <span>500원</span>
      </div>
    </div>
  );
};

const TradeOptionCard = ({
  title,
  description,
  sub,
  icon,
  active,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer border rounded-lg p-4 transition
        ${active ? "border-green-700" : "border-gray-200"}
      `}
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
};

const PurchasePanelPage = () => {
  const [tradeType, setTradeType] = useState("DELIVERY"); // DELIVERY | DIRECT
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl border p-4 space-y-4">
      {/* 거래 방식 */}
      <TradeOptionCard
        title="택배 거래"
        description="배송비 무료 상품입니다."
        active={tradeType === "DELIVERY"}
        icon={<CheckCircle />}
        onClick={() => setTradeType("DELIVERY")}
      />

      <TradeOptionCard
        title="만나서 직거래"
        description="상품을 직접 받을 수 있어요"
        sub="염창동"
        active={tradeType === "DIRECT"}
        icon={<MapPin />}
        onClick={() => setTradeType("DIRECT")}
      />

      {/* 가격 요약 */}
      <div className="border rounded-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-medium">예상 결제금액</span>
          <div
            className="cursor-pointer"
            onClick={() => setShowDetail((prev) => !prev)}
          >
            {showDetail ? <ChevronDown /> : <ChevronUp />}
          </div>
        </div>

        <div className="px-4 pb-3 flex justify-between text-sm font-semibold text-green-700">
          <span>500원</span>
        </div>

        {/* 상세 사이드바 */}
        {showDetail && <PriceDetail />}
      </div>

      {/* 구매 버튼 */}
      <Link
        to="payment"
        state={{
          tradeType,
        }}
      >
        <button className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg">
          구매하기
        </button>
      </Link>
    </div>
  );
};

export default PurchasePanelPage;
