import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderCompleteApi } from "@/common/api/order.api";

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-4 space-y-2">
    <div className="text-sm font-semibold">{title}</div>
    {children}
  </div>
);

const Row = ({ label, value, bold }) => (
  <div
    className={`flex justify-between text-sm ${bold ? "font-semibold" : ""}`}
  >
    <span className="text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);

// API 응답을 신뢰해 금액/수수료/최종금액을 채우고, 필수 데이터 누락 시 가드 및 안내 추가.
const normalizeOrderData = (data) => {
  if (!data) return null;

  const tradeType = data.tradeType === "DELIVERY" ? "DELIVERY" : "DIRECT";
  const isDelivery = tradeType === "DELIVERY";
  const amountPaid = Number(data.amountPaid ?? data.productPrice ?? 0);
  const paymentFee = Number.isFinite(data.paymentFee)
    ? Number(data.paymentFee)
    : 0;

  return {
    orderId: data.orderId ?? "",
    tradeType,
    createdAt: data.createdAt ?? "",
    product: {
      title: data.productTitle ?? "",
      price: amountPaid,
      imageUrl: data.productImageUrl ?? "",
    },
    receiver: isDelivery
      ? {
          name: data.receiverName ?? "",
          phone: data.receiverPhone ?? "",
          address: data.deliveryAddress ?? "",
        }
      : null,
    payment: {
      method: data.paymentMethod ?? "",
      totalAmount: amountPaid,
      fee: paymentFee,
      finalAmount: amountPaid + paymentFee,
    },
  };
};

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate("/", { replace: true });
      return;
    }

    let active = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderCompleteApi(orderId);
        if (!active) return;
        setOrder(normalizeOrderData(data));
      } catch (err) {
        console.error("주문 완료 정보 조회 실패", err);
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      active = false;
    };
  }, [orderId, navigate]);

  if (!orderId) return null;

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 text-sm text-gray-600">
        주문 정보를 불러오는 중입니다...
      </div>
    );
  }

  // 조회 실패/데이터 오류 시 재시도 버튼(새로고침)과 홈 이동 제공.
  // // API 응답을 신뢰해 금액/수수료/최종금액을 채우고, 필수 데이터 누락 시 가드 및 안내 추가.
  if (error || !order) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="text-sm text-red-600">
          주문 정보를 불러오지 못했습니다.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-green-700 text-white py-3 rounded-lg text-sm"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 border py-3 rounded-lg text-sm"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  // 제품 이미지/결제 정보/주소 등을 null-safe로 렌더링.
  const { tradeType, createdAt, product, receiver, payment } = order;
  const isDelivery = tradeType === "DELIVERY";
  const formattedDate = createdAt
    ? createdAt.replace("T", " ").slice(0, 16)
    : "";
  const tradeTypeLabel = isDelivery ? "택배 거래" : "직거래";
  const displayOrderId = order.orderId || orderId;
  const productPrice = Number(product?.price ?? 0);
  const paymentTotal = Number.isFinite(payment?.totalAmount)
    ? Number(payment.totalAmount)
    : productPrice;
  // 결제 수수료는 응답 값이 없으면 0으로 표기.
  const paymentFee = Number.isFinite(payment?.fee) ? Number(payment.fee) : 0;
  const paymentFinal = Number.isFinite(payment?.finalAmount)
    ? Number(payment.finalAmount)
    : paymentTotal + paymentFee;
  const productImageUrl = product?.imageUrl;

  if (!product?.title || !payment?.method || !displayOrderId) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div className="text-sm text-red-600">
          주문 데이터가 올바르지 않습니다.
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-green-700 text-white py-3 rounded-lg text-sm"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate("/", { replace: true })}
            className="flex-1 border py-3 rounded-lg text-sm"
          >
            홈으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-28">
      <div className="flex flex-col items-center py-10 space-y-4">
        <CheckCircle size={64} className="text-green-600" />
        <div className="text-lg font-semibold">주문 완료</div>
        <div className="text-sm text-gray-500 text-center">
          거래번호 {displayOrderId}
          <br />
          구매가 완료되었어요.
        </div>
      </div>

      {/* 제품 이미지/결제 정보/주소 등을 null-safe로 렌더링. */}
      <Section title="상품 정보">
        <div className="flex gap-3 items-center">
          {productImageUrl ? (
            <img src={productImageUrl} alt="" className="w-14 h-14 rounded" />
          ) : (
            <div className="w-14 h-14 rounded bg-gray-100" />
          )}
          <div>
            <div className="text-sm font-medium">{product?.title}</div>
            <div className="text-xs text-gray-500">
              {productPrice.toLocaleString()}원
            </div>
          </div>
        </div>
      </Section>

      {isDelivery && receiver && (
        <Section title="배송지 정보">
          <Row label="이름" value={receiver?.name} />
          <Row label="연락처" value={receiver?.phone} />
          <Row label="주소" value={receiver?.address} />
        </Section>
      )}

      <Section title="거래 정보">
        <Row label="결제일시" value={formattedDate} />
        <Row label="거래방식" value={tradeTypeLabel} />
        <Row label="결제수단" value={payment?.method} />
      </Section>

      <Section title="결제금액 정보">
        <Row label="상품금액" value={`${paymentTotal.toLocaleString()}원`} />
        <Row label="결제 수수료" value={`${paymentFee.toLocaleString()}원`} />
        <Row
          label="최종 결제 금액"
          value={`${paymentFinal.toLocaleString()}원`}
          bold
        />
      </Section>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="w-1/2 border py-3 rounded-lg text-sm"
        >
          계속 둘러보기
        </button>
        <button
          onClick={() => navigate("/me/purchases")}
          className="w-1/2 bg-green-700 text-white py-3 rounded-lg text-sm"
        >
          구매 이력
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;
