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
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center">
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full max-w-[600px] py-3 rounded-lg font-semibold cursor-pointer ${
        disabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-green-700 text-white"
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
  <div className="border rounded-lg p-4 text-sm">
    <div className="flex justify-between items-center">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={onToggleAll}
      >
        <CheckCircle
          className={terms.all ? "text-green-700" : "text-gray-300"}
        />
        <span className="font-medium">전체 약관 동의</span>
      </div>

      <button onClick={onToggleDetail}>
        {showTerms ? <ChevronUp /> : <ChevronDown />}
      </button>
    </div>

    {showTerms && (
      <div className="mt-3 space-y-2 pl-6">
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
  const totalAmount = sellPrice + paymentFee;

  return (
    <div className="border rounded-lg p-4 text-sm space-y-2">
      <Row label="상품 금액" value={`${sellPrice.toLocaleString()}원`} />
      <Row
        label={`결제 수수료 (${(feeRate * 100).toFixed(1)}%)`}
        value={`${paymentFee.toLocaleString()}원`}
      />
      <Row
        label="최종 결제 금액"
        value={`${totalAmount.toLocaleString()}원`}
        bold
      />
    </div>
  );
};

const PaymentSection = () => {
  const methods = [
    "네이버페이",
    "카카오페이",
    "신용/체크카드",
    "계좌이체",
    "무통장입금",
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
}) => (
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
      <div className="bg-white">
        <div className="space-y-6">
          <div className="text-sm font-medium">
            거래 방식: {tradeType === "DELIVERY" ? "택배 거래" : "직거래"}
          </div>

          <ProductSummary
            // 제품 이미지 접근을 optional chaining으로 수정해 로드 전 런타임 오류 방지.
            imageUrl={product.images?.[0]?.imageUrl}
            sellPrice={product.sellPrice}
            productStatus={product.productStatus.description}
            productTitle={product.productTitle}
          />

          {tradeType === "DELIVERY" && (
            <DeliverySection
              address={address}
              handleNavigate={handleNavigate}
            />
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
      </div>
    </Container>
  );
};

export default PurchasePage;
