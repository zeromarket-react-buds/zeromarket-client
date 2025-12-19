import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { CheckCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Container from "@/components/Container";
import { createOrderApi } from "@/common/api/order.api";
import { getAddressDetail, getDefaultAddress } from "@/common/api/address.api";
import { usePurchase } from "@/hooks/PurchaseContext";

// 하단 결제 버튼
const BottomPayButton = ({ disabled, sellPrice, handleSubmit }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center">
      <button
        onClick={handleSubmit}
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

const DeliverySection = ({ address, handleNavigate }) => {
  const hasAddress = Boolean(address?.addressId);

  return (
    <div className="border rounded-lg p-4">
      <div className="text-sm font-semibold mb-2">배송지</div>

      {hasAddress ? (
        <div onClick={handleNavigate} className="cursor-pointer">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="font-medium">{address.receiverName}</span>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {address.zipcode} {address.addrBase} {address.addrDetail}
          </div>
        </div>
      ) : (
        <button
          onClick={handleNavigate}
          className="w-full border rounded-lg py-2 text-sm text-gray-500 cursor-pointer"
        >
          + 배송지 선택
        </button>
      )}
    </div>
  );
};

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
  // const location = useLocation();
  const navigate = useNavigate();

  const { product } = useOutletContext();

  // const { tradeType } = useParams();

  const { tradeType, addressId, setAddressId } = usePurchase();

  // const [tradeType, setTradeType] = useState(null);
  // const [addressId, setAddressId] = useState(null);
  const [address, setAddress] = useState({});
  // const { tradeType } = location.state || {}; // 이전 페이지에서 전달된 거래 방식
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

  useEffect(() => {
    /* 🔒 tradeType 없으면 접근 차단 */
    if (!tradeType) {
      navigate(`/products/${product.productId}`);
    }
  }, []);

  // 대표 배송지 초기 로딩
  useEffect(() => {
    if (tradeType !== "DELIVERY") return;

    const fetchAddress = async () => {
      // 1️⃣ Context에 addressId가 있으면 그걸 우선
      if (addressId) {
        const data = await getAddressDetail(addressId);
        setAddress(data);
        return;
      }

      // 2️⃣ 없으면 대표 배송지 조회
      const defaultAddr = await getDefaultAddress();
      if (defaultAddr) {
        setAddress(defaultAddr);
        setAddressId(defaultAddr.addressId);
      }
    };

    fetchAddress();
  }, []);

  // addressId 변경 시 배송지 조회
  useEffect(() => {
    if (!addressId) return;

    console.log("addressId 변경: ", addressId);

    const fetchAddressDetail = async () => {
      const data = await getAddressDetail(addressId);
      console.log(data);
      setAddress(data);
    };
    fetchAddressDetail();
  }, [addressId]);

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

  // 주소 조회 페이지 이동
  const handleNavigate = () => {
    navigate(`/purchase/${product.productId}/addresses?tradeType=${tradeType}`);
  };

  const handleSubmit = async () => {
    if (tradeType === "DELIVERY" && !address) {
      alert("배송지를 선택해주세요.");
      return;
    }

    if (tradeType === "DIRECT") {
      // todo: 배송지 로직 전부 무시
    }

    try {
      const data = await createOrderApi({
        productId: product.productId,
        amountPaid: product.sellPrice,
        tradeType,
        paymentMethod: "INTERNAL",

        receiverName: address.receiverName,
        receiverPhone: address.receiverPhone,
        zipcode: address.zipcode,
        addrBase: address.addrBase,
        addrDetail: address.addrDetail,
      });

      console.log("결제 성공: ", data);

      navigate(`/orders/${res.orderId}/complete`);
    } catch (err) {
      console.error(err);
    }
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

          {tradeType === "DELIVERY" && (
            <DeliverySection
              address={address}
              handleNavigate={handleNavigate}
            />
          )}

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
        <BottomPayButton
          handleSubmit={handleSubmit}
          disabled={!terms.all}
          sellPrice={product.sellPrice}
        />
      </div>
    </Container>
  );
};

export default PurchasePage;
