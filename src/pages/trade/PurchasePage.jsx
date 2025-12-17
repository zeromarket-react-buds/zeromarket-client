import { useEffect, useState } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { CheckCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Container from "@/components/Container";

// 하단 결제 버튼
const BottomPayButton = ({ disabled, sellPrice }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center">
      <button
        disabled={disabled}
        className={`w-full max-w-[600px] py-3 rounded-lg font-semibold cursor-pointer
      ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-green-700 text-white"
      }
    `}
      >
        {Number(sellPrice).toLocaleString()}원 결제
      </button>
    </div>
  );
};

const TermItem = ({ label, checked, onClick }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
      <CheckCircle
        size={18}
        className={checked ? "text-green-700" : "text-gray-300"}
      />
      <span>{label}</span>
    </div>
  );
};

const TermsAgreement = ({
  terms,
  showTerms,
  onToggleAll,
  onToggleItem,
  onToggleDetail,
}) => {
  return (
    <div className="border rounded-lg p-4 text-sm">
      <div className="flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={onToggleAll}
        >
          <CheckCircle
            className={terms.all ? "text-green-700" : "text-gray-300"}
          />
          <span className="font-medium">이용약관 전체 동의</span>
        </div>

        <button onClick={onToggleDetail}>
          {showTerms ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>

      {showTerms && (
        <div className="mt-3 space-y-2 pl-6">
          <TermItem
            label="결제 서비스 이용 동의"
            checked={terms.items.payment}
            onClick={() => onToggleItem("payment")}
          />
          <TermItem
            label="개인정보 수집 및 이용 동의"
            checked={terms.items.personal}
            onClick={() => onToggleItem("personal")}
          />
          <TermItem
            label="제3자 정보 제공 동의"
            checked={terms.items.thirdParty}
            onClick={() => onToggleItem("thirdParty")}
          />
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, bold }) => {
  return (
    <div className={`flex justify-between ${bold && "font-semibold"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
};

const PriceSummary = () => {
  return (
    <div className="border rounded-lg p-4 text-sm space-y-2">
      <Row label="상품 금액" value="7,000원" />
      <Row label="안심 결제 수수료 3.6%" value="24원" />
      <Row label="최종 결제 금액" value="7,000원" bold />
    </div>
  );
};

const PaymentSection = () => {
  const methods = [
    "카드 결제",
    "무통장입금",
    "토스페이",
    "네이버페이",
    "카카오페이",
    "PAYCO",
  ];

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="text-sm font-semibold">결제 수단</div>
      <div className="grid grid-cols-2 gap-2">
        {methods.map((m) => (
          <button key={m} className="border rounded-lg py-2 text-sm">
            {m}
          </button>
        ))}
      </div>
    </div>
  );
};

const DeliverySection = () => {
  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm font-semibold mb-2">배송지</div>
      <button className="w-full border rounded-lg py-2 text-sm text-gray-500">
        + 배송지 추가
      </button>
    </div>
  );
};

// const TradeCard = ({ title, sub, active, onClick }) => {
//   return (
//     <div
//       onClick={onClick}
//       className={`border rounded-lg p-4 cursor-pointer
//         ${active ? "border-green-700" : "border-gray-200"}
//       `}
//     >
//       <div className="flex gap-3 items-center">
//         <CheckCircle className={active ? "text-green-700" : "text-gray-300"} />
//         <div>
//           <div className="text-sm font-medium">{title}</div>
//           {sub && (
//             <div className="flex items-center gap-1 text-xs text-gray-500">
//               <MapPin size={12} />
//               {sub}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const TradeTypeSection = ({ tradeType, setTradeType }) => {
//   return (
//     <div className="space-y-2">
//       <TradeCard
//         title="택배 거래"
//         active={tradeType === "DELIVERY"}
//         onClick={() => setTradeType("DELIVERY")}
//       />
//       <TradeCard
//         title="만나서 직거래"
//         sub="염창동"
//         active={tradeType === "DIRECT"}
//         onClick={() => setTradeType("DIRECT")}
//       />
//     </div>
//   );
// };

const ProductSummary = ({
  imageUrl,
  productStatus,
  sellPrice,
  productTitle,
}) => {
  return (
    <div className="flex gap-3 items-center">
      <img src={imageUrl} alt="" className="w-14 h-14 rounded" />
      <div>
        <div className="text-sm font-medium">
          {productTitle} ({productStatus})
        </div>
        <div className="text-xs text-gray-500">
          {Number(sellPrice).toLocaleString()}원
        </div>
      </div>
    </div>
  );
};

const PurchasePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = useOutletContext();

  const { tradeType } = location.state || {}; // 이전 페이지에서 전달된 거래 방식
  // const [tradeType, setTradeType] = useState("DELIVERY"); // DELIVERY | DIRECT
  const [showTerms, setShowTerms] = useState(false);

  const [terms, setTerms] = useState({
    all: false,
    items: {
      payment: false,
      personal: false,
      thirdParty: false,
    },
  });

  /* 🔒 tradeType 없으면 접근 차단 */
  useEffect(() => {
    if (!tradeType) {
      navigate(-1);
    }

    console.log(product);
  }, [tradeType, navigate]);

  /* 약관 로직 */
  const toggleAllTerms = () => {
    const next = !terms.all;

    setTerms({
      all: next,
      items: {
        payment: next,
        personal: next,
        thirdParty: next,
      },
    });
  };

  const toggleTerm = (key) => {
    const updated = {
      ...terms.items,
      [key]: !terms.items[key],
    };

    const allChecked = Object.values(updated).every(Boolean);

    setTerms({
      all: allChecked,
      items: updated,
    });
  };

  return (
    <Container>
      <div className="bg-white">
        <div className="space-y-6">
          {/* 🔎 거래 방식은 표시만 */}
          <div className="text-sm font-medium">
            거래 방식:{" "}
            {tradeType === "DELIVERY" ? "택배 거래" : "만나서 직거래"}
          </div>

          <ProductSummary
            imageUrl={product.images[0].imageUrl}
            sellPrice={product.sellPrice}
            productStatus={product.productStatus.description}
            productTitle={product.productTitle}
          />

          {/* <TradeTypeSection tradeType={tradeType} setTradeType={setTradeType} /> */}

          {tradeType === "DELIVERY" && <DeliverySection />}

          <PaymentSection />

          <PriceSummary />

          <TermsAgreement
            terms={terms}
            showTerms={showTerms}
            onToggleAll={toggleAllTerms}
            onToggleItem={toggleTerm}
            onToggleDetail={() => setShowTerms((p) => !p)}
          />
        </div>

        {/* ✅ 약관 전체 동의해야 결제 가능 */}
        <BottomPayButton disabled={!terms.all} sellPrice={product.sellPrice} />
      </div>
    </Container>
  );
};

export default PurchasePage;
