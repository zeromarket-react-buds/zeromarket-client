import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDefaultAddress } from "@/common/api/address.api";

const Section = ({ title, children }) => (
  <div className="border rounded-lg p-4 space-y-2">
    <div className="text-sm font-semibold">{title}</div>
    {children}
  </div>
);

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between text-sm ${bold && "font-semibold"}`}>
    <span className="text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);

const OrderCompletePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  /**
   * state에 orderComplete 데이터가 담겨 있다고 가정
   * navigate("/orders/complete", { state: orderResult })
   */
  if (!state) {
    navigate("/");
    return null;
  }

  const { orderId, tradeType, createdAt, product, receiver, payment } = state;

  return (
    <div className="max-w-md mx-auto pb-28">
      {/* 상단 완료 아이콘 */}
      <div className="flex flex-col items-center py-10 space-y-4">
        <CheckCircle size={64} className="text-green-600" />
        <div className="text-lg font-semibold">주문 완료</div>
        <div className="text-sm text-gray-500 text-center">
          거래번호 {orderId}
          <br />
          판매자 주문 확인 후 거래가 진행됩니다.
        </div>
      </div>

      {/* 상품 정보 */}
      <Section title="상품 정보">
        <div className="flex gap-3 items-center">
          <img src={product.imageUrl} alt="" className="w-14 h-14 rounded" />
          <div>
            <div className="text-sm font-medium">{product.title}</div>
            <div className="text-xs text-gray-500">
              {product.price.toLocaleString()}원
            </div>
          </div>
        </div>
      </Section>

      {/* 배송지 정보 (DELIVERY만 표시) */}
      {tradeType === "DELIVERY" && (
        <Section title="배송지 정보">
          <Row label="이름" value={receiver.name} />
          <Row label="연락처" value={receiver.phone} />
          <Row label="주소" value={receiver.address} />
        </Section>
      )}

      {/* 거래 정보 */}
      <Section title="거래 정보">
        <Row label="결제일시" value={createdAt.replace("T", " ")} />
        <Row
          label="거래방식"
          value={tradeType === "DELIVERY" ? "택배 거래" : "직거래"}
        />
        <Row label="결제수단" value={payment.method} />
      </Section>

      {/* 결제 금액 */}
      <Section title="결제금액 정보">
        <Row
          label="상품금액"
          value={`${payment.totalAmount.toLocaleString()}원`}
        />
        <Row
          label="안심결제 수수료"
          value={`${payment.fee.toLocaleString()}원`}
        />
        <Row
          label="최종 결제 금액"
          value={`${payment.finalAmount.toLocaleString()}원`}
          bold
        />
      </Section>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="w-1/2 border py-3 rounded-lg text-sm"
        >
          계속 쇼핑
        </button>
        <button
          onClick={() => navigate("/my/orders")}
          className="w-1/2 bg-green-700 text-white py-3 rounded-lg text-sm"
        >
          구매내역
        </button>
      </div>
    </div>
  );
};

export default OrderCompletePage;
