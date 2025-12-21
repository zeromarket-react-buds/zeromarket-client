// tradeFlow 종류
export const FLOW = {
  INSTANT_DELIVERY: "INSTANT_DELIVERY",
  INSTANT_DIRECT: "INSTANT_DIRECT",
  CHAT_DIRECT: "CHAT_DIRECT",
};

// tradeFlow 판별용. order가 있으면 바로구매, 없으면 채팅
export const tradeFlowLabels = (params = {}) => {
  const { orderId, hasOrder, tradeType } = params;

  const ordered = Boolean(hasOrder ?? orderId);

  // order 없으면 채팅(직거래)
  if (!ordered) return FLOW.CHAT_DIRECT;

  // order 있으면 바로구매 + tradeType으로 택배/직거래 구분
  const key = tradeType?.name ?? tradeType?.description ?? tradeType;

  if (key === "DELIVERY" || key === "택배거래") return FLOW.INSTANT_DELIVERY;
  if (key === "DIRECT" || key === "직거래") return FLOW.INSTANT_DIRECT;
};

// 종류별로 나뉘어지는  tradeFlow 시스템
export const tradeFlows = {
  [FLOW.INSTANT_DELIVERY]: [
    { label: "결제완료", key: "PAID" },
    { label: "주문확인", key: "DELIVERY_READY" },
    { label: "배송중", key: "SHIPPED" },
    { label: "배송완료", key: "DELIVERED" },
    { label: "거래완료", key: "COMPLETED" },
  ],
  [FLOW.INSTANT_DIRECT]: [
    { label: "결제완료", key: "PAID" },
    { label: "주문확인", key: "DELIVERY_READY" },
    { label: "거래완료", key: "COMPLETED" },
  ],
  [FLOW.CHAT_DIRECT]: [
    { label: "예약중", key: "PENDING" },
    { label: "거래완료", key: "COMPLETED" },
  ],
};

// 같은 상태 key라도 거래 흐름(flowType)에 따라 화면에 보여줄 문구(label)를 다르게 결정
export const getStatusLabelByKey = (flowType, key) => {
  const steps = tradeFlows[flowType] || [];
  return steps.find((s) => s.key === key)?.label;
};

/*
  화면 표시용 상태키 정규화
  - CHAT_DIRECT: trade_status 사용
  - INSTANT_*: order_status 사용 (trade_status가 COMPLETED/CANCELED면 그게 우선)
*/
export const getDisplayStatusKey = (params = {}) => {
  const { flowType, tradeStatusKey, orderStatusKey } = params;

  if (!flowType) return null;

  // 종료 상태는 trade가 우선
  if (tradeStatusKey === "COMPLETED") return "COMPLETED";
  if (tradeStatusKey === "CANCELED") return "CANCELED";

  // 채팅 흐름은 trade_status 기반
  if (flowType === FLOW.CHAT_DIRECT) return tradeStatusKey || null;

  // 바로구매 흐름은 order_status 기반
  if (orderStatusKey) return orderStatusKey;

  return null;
};

/*
  MySales/MyPurchases/TradeDetail 공통으로 쓰는 상태 계산용
  trade 객체(목록/상세 응답)를 그대로 넣으면 동일한 결과 셍상
*/
export const buildTradeViewState = (trade = {}) => {
  const flowType = tradeFlowLabels({
    orderId: trade.orderId,
    hasOrder: trade.hasOrder,
    tradeType: trade.tradeType,
  });

  const tradeStatusKey = trade.tradeStatus?.name ?? trade.tradeStatus ?? null;
  const orderStatusKey = trade.orderStatus?.name ?? trade.orderStatus ?? null;

  const displayStatusKey = getDisplayStatusKey({
    flowType,
    tradeStatusKey,
    orderStatusKey,
  });

  const isCanceled = displayStatusKey === "CANCELED";
  const isCompleted = displayStatusKey === "COMPLETED";

  return {
    flowType,
    tradeStatusKey,
    orderStatusKey,
    displayStatusKey,
    isCanceled,
    isCompleted,
  };
};
