// trade 테이블만 사용해서 쓰는 임시용
export const tradeFlowLabels = ({ tradeType }) => {
  const key = tradeType.description;

  // 택배거래: 바로구매 - 택배거래(5단계)
  if (key === "택배거래") {
    return "INSTANT_DELIVERY";
  }

  // 직거래: 바로구매 - 직거래(3단계)로 가정
  if (key === "직거래") {
    return "INSTANT_DIRECT";
  }

  // 그 외: 채팅 - 직거래(2단계)
  return "CHAT_DIRECT";
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
