// trade 테이블만 사용해서 쓰는 임시용
export const tradeFlowLabels = (params = {}) => {
  const { tradeType } = params;

  // tradeType 자체가 없으면 기본 흐름(방어용)
  if (!tradeType) {
    return "CHAT_DIRECT";
  }

  const key = tradeType.description ?? tradeType.name ?? String(tradeType);

  // 택배거래: 바로구매 - 택배거래(5단계)
  if (key === "택배거래" || key === "DELIVERY") {
    return "INSTANT_DELIVERY";
  }

  // 직거래: 바로구매 - 직거래(3단계)
  if (key === "직거래" || key === "DIRECT") {
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

// tradeFlows를 한 번만 돌면서 "라벨 → 상태 key" 맵 생성
const tradeStatusKeyByLabel = {};

Object.values(tradeFlows).forEach((steps) => {
  steps.forEach((step) => {
    // 같은 라벨이 여러 단계에 있어도, 먼저 들어온 값 사용
    if (!tradeStatusKeyByLabel[step.label]) {
      tradeStatusKeyByLabel[step.label] = step.key;
    }
  });
});

// 화면용 라벨로부터 enum key 구하는 헬퍼
export const getTradeStatusKey = (label, fallbackKey) => {
  if (!label) {
    return fallbackKey || null;
  }
  return tradeStatusKeyByLabel[label] || fallbackKey || null;
};
