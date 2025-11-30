// trade 테이블만 사용해서 쓰는 임시용
export const tradeFlowLabels = ({ isDelivery, isDirect }) => {
  if (isDelivery && !isDirect) {
    // 택배만 가능한 경우: 바로결제 택배 플로우로 처리
    return "INSTANT_DELIVERY";
  }

  if (!isDelivery && isDirect) {
    // 직거래만 가능한 경우: 채팅 직거래 플로우로 처리
    return "CHAT_DIRECT";
  }

  // 둘 다 true거나 둘 다 false: 바로결제 직거래 플로우로 처리
  return "INSTANT_DIRECT";
};

export const tradeFlows = {
  INSTANT_DELIVERY: [
    { key: "PENDING", label: "결제완료" },
    { key: "PENDING", label: "주문확인" },
    { key: "PENDING", label: "배송중" },
    { key: "PENDING", label: "배송완료" },
    { key: "COMPLETED", label: "거래완료" },
  ],
  INSTANT_DIRECT: [
    { key: "PENDING", label: "결제완료" },
    { key: "PENDING", label: "주문확인" },
    { key: "COMPLETED", label: "거래완료" },
  ],
  CHAT_DIRECT: [
    { key: "PENDING", label: "예약중" },
    { key: "COMPLETED", label: "거래완료" },
  ],
};
