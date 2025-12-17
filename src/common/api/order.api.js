import { apiClient } from "@/common/client";

/**
 * 주문 생성 (결제하기 버튼)
 */
export const createOrderApi = async (payload) => {
  const { data } = await apiClient("/api/orders", {
    method: "POST",
    body: payload,
  });

  return data;
};

/**
 * 배송 준비 상태로 변경
 * PAID → DELIVERY_READY
 */
export const markDeliveryReadyApi = (orderId) => {
  return apiClient(`/api/orders/${orderId}/delivery-ready`, {
    method: "POST",
  });
};

/**
 * 배송 시작
 * DELIVERY_READY → SHIPPED
 */
export const shipOrderApi = (orderId) => {
  return apiClient(`/api/orders/${orderId}/ship`, {
    method: "POST",
  });
};

/**
 * 거래 완료
 * SHIPPED → DELIVERED
 */
export const completeOrderApi = (orderId) => {
  return apiClient(`/api/orders/${orderId}/complete`, {
    method: "POST",
  });
};

/**
 * 주문 취소
 * PAID / DELIVERY_READY → CANCELED
 */
export const cancelOrderApi = (orderId) => {
  return apiClient(`/api/orders/${orderId}/cancel`, {
    method: "POST",
  });
};
