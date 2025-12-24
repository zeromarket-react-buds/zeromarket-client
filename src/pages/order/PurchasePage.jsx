import { useEffect, useState } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { CheckCircle, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import Container from "@/components/Container";
import { createOrderApi } from "@/common/api/order.api";
import {
  getAddressDetail,
  getDefaultAddress,
  getMyAddresses,
} from "@/common/api/address.api";

const BottomPayButton = ({ disabled, label, onClick }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center z-20 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-[720px] py-3 rounded-lg font-semibold cursor-pointer ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-green-700 text-white hover:bg-green-800"
      }`}
    >
      {label}
    </button>
  </div>
);

const TermItem = ({ label, checked, onClick }) => (
  <div className="flex items-center gap-2 cursor-pointer" onClick={onClick}>
    <CheckCircle
      size={18}
      className={checked ? "text-green-700" : "text-gray-300"}
    />
    <span>{label}</span>
  </div>
);

const TermsAgreement = ({
  terms,
  showTerms,
  onToggleAll,
  onToggleItem,
  onToggleDetail,
}) => (
  <div className="border rounded-lg p-4 text-sm bg-white space-y-3">
    <div className="flex justify-between items-center">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onToggleAll}
      >
        <CheckCircle
          className={terms.all ? "text-green-700" : "text-gray-300"}
        />
        <span className="font-medium">
          상품정보 및 결제 대행 서비스 이용약관 동의
        </span>
      </div>

      <button onClick={onToggleDetail}>
        {showTerms ? <ChevronUp /> : <ChevronDown />}
      </button>
    </div>

    {showTerms && (
      <div className="space-y-2 pl-6">
        <TermItem
          label="결제 이용 동의"
          checked={terms.items.payment}
          onClick={() => onToggleItem("payment")}
        />
        <TermItem
          label="개인정보 수집·이용 동의"
          checked={terms.items.personal}
          onClick={() => onToggleItem("personal")}
        />
        <TermItem
          label="개인정보 제3자 제공 동의"
          checked={terms.items.thirdParty}
          onClick={() => onToggleItem("thirdParty")}
        />
      </div>
    )}
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const PriceSummary = ({ sellPrice, feeRate = 0 }) => {
  const paymentFee = 0; // 결제 수수료 없음
  const totalAmount = sellPrice; // 최종 금액 = 상품 금액

  return (
    <div className="border rounded-lg p-4 text-sm space-y-2 bg-white">
      <div className="flex items-center justify-between font-semibold text-base">
        <span>최종 결제 금액</span>
        <span className="text-green-700">
          {totalAmount.toLocaleString()}원
        </span>
      </div>
      <div className="border-t pt-3 space-y-1">
        <Row label="상품 금액" value={`${sellPrice.toLocaleString()}원`} bold />
        <Row
          label={`안심 결제 수수료 ${feeRate * 100}%`}
          value={<span className="text-gray-400 line-through">0원</span>}
        />
      </div>
    </div>
  );
};

const PaymentSection = () => {
  const methods = [
    "토스페이",
    "네이버페이",
    "카카오페이",
    "페이코",
    "카드 결제",
    "무통장입금",
  ];

  return (
    <div className="border rounded-lg p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between text-sm font-semibold">
        <span>안심결제 선택</span>
        <span className="text-xs text-gray-500">
          오늘도 안전해서, 안심결제
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {methods.map((m) => (
          <button
            key={m}
            className="border rounded-lg py-3 text-sm font-medium bg-gray-50 hover:bg-white"
          >
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
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between text-sm font-semibold mb-3">
        <span>배송지 정보</span>
        <button
          className="text-xs text-gray-600 underline"
          onClick={handleNavigate}
        >
          배송지 변경
        </button>
      </div>

      {hasAddress ? (
        <div
          onClick={handleNavigate}
          className="cursor-pointer border rounded-lg p-3 bg-gray-50 hover:bg-white"
        >
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
          className="w-full border rounded-lg py-3 text-sm text-gray-600 cursor-pointer bg-gray-50 hover:bg-white"
        >
          + 배송지 추가
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
  tradeLabel,
}) => (
  <div className="flex gap-3 items-center border rounded-lg p-4 bg-white">
    <img
      src={imageUrl}
      alt=""
      className="w-14 h-14 rounded object-cover bg-gray-100"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2 text-xs text-green-700 font-semibold">
        <span className="px-2 py-0.5 bg-green-50 rounded-full border border-green-200">
          {tradeLabel}
        </span>
        <span className="text-gray-500">{productStatus}</span>
      </div>
      <div className="text-sm font-medium mt-1">{productTitle}</div>
      <div className="text-sm font-semibold text-green-700 mt-1">
        {Number(sellPrice).toLocaleString()}원
      </div>
    </div>
  </div>
);

const PurchasePage = () => {
  const navigate = useNavigate();
  const { product } = useOutletContext();

  const [address, setAddress] = useState({});
  const [showTerms, setShowTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDefaultAddressLoaded, setIsDefaultAddressLoaded] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const tradeType = searchParams.get("tradeType"); // DELIVERY | DIRECT
  const addressId = searchParams.get("addressId"); // null | number

  const [terms, setTerms] = useState({
    all: false,
    items: {
      payment: false,
      personal: false,
      thirdParty: false,
    },
  });

  // 상품 상태 2차 검증
  const productStatusCode = product?.salesStatus.name;

  useEffect(() => {
    if (!product) return;
    const BLOCKED_STATUS = ["RESERVED", "SOLD_OUT"];
    const isForSale = productStatusCode === "FOR_SALE";

    if (!isForSale || BLOCKED_STATUS.includes(productStatusCode)) {
      alert("판매 중이 아닌 상품입니다. 상품 페이지로 이동합니다.");
      navigate(`/products/${product.productId}`, { replace: true });
    }
  }, [product, productStatusCode, navigate]);

  useEffect(() => {
    if (!tradeType && product?.productId) {
      navigate(`/products/${product.productId}`);
    }
  }, [navigate, product?.productId, tradeType]);

  // 배송 거래일 때 기본 배송지 로드 (쿼리 주소가 없으면 기본주소/최초주소 선택)
  useEffect(() => {
    if (tradeType !== "DELIVERY") return;
    if (isDefaultAddressLoaded) return;

    const loadAddress = async () => {
      try {
        if (addressId) {
          const data = await getAddressDetail(addressId);
          setAddress(data);
          return;
        }

        const defaultAddr = await getDefaultAddress().catch(() => null);

        if (defaultAddr) {
          setAddress(defaultAddr);
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("addressId", defaultAddr.addressId);
            return next;
          });
          return;
        }

        const addresses = await getMyAddresses();
        if (addresses?.length) {
          // 기본 주소 없으면 첫 번째 주소 선택
          const first = addresses.find((a) => a.isDefault) || addresses[0];
          setAddress(first);
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("addressId", first.addressId);
            return next;
          });
        }
      } finally {
        setIsDefaultAddressLoaded(true);
      }
    };

    loadAddress();
  }, [tradeType, addressId, setSearchParams, isDefaultAddressLoaded]);

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

  const handleNavigate = () => {
    navigate(`/purchase/${product.productId}/addresses?tradeType=${tradeType}`);
  };

  const feeRate = 0;
  const paymentFee = 0;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!tradeType) {
      alert("거래 방식을 선택해주세요.");
      return;
    }

    if (tradeType === "DELIVERY" && !address.addressId) {
      alert("배송지를 선택해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await createOrderApi({
        productId: product.productId,
        amountPaid: product.sellPrice,
        tradeType,
        paymentMethod: "INTERNAL",
        ...(tradeType === "DELIVERY" && {
          receiverName: address.receiverName,
          receiverPhone: address.receiverPhone,
          zipcode: address.zipcode,
          addrBase: address.addrBase,
          addrDetail: address.addrDetail,
        }),
      });

      navigate(`/orders/${data.orderId}/complete`);
    } catch (err) {
      console.log(err.code);

      if (err.code === "TRADE_ALREADY_EXIST") {
        alert("예약 중인 상품입니다.");
        navigate("/");
        return;
      }
      alert("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const payableLabel = `${Number(
    product.sellPrice + paymentFee
  ).toLocaleString()}원 결제하기`;

  return (
    <Container>
      <div className="bg-white pb-28 space-y-6">
        <ProductSummary
          imageUrl={product.images?.[0]?.imageUrl}
          sellPrice={product.sellPrice}
          productStatus={product.productStatus.description}
          productTitle={product.productTitle}
          tradeLabel={tradeType === "DELIVERY" ? "택배 거래" : "만나서 직거래"}
        />

        {tradeType === "DELIVERY" && (
          <DeliverySection address={address} handleNavigate={handleNavigate} />
        )}

        <PaymentSection />

        <PriceSummary sellPrice={product.sellPrice} feeRate={feeRate} />

        <TermsAgreement
          terms={terms}
          showTerms={showTerms}
          onToggleAll={toggleAllTerms}
          onToggleItem={toggleTerm}
          onToggleDetail={() => setShowTerms((p) => !p)}
        />
      </div>

      <BottomPayButton
        onClick={handleSubmit}
        disabled={!terms.all || isSubmitting}
        label={payableLabel}
      />
    </Container>
  );
};

export default PurchasePage;
