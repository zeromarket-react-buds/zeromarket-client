import { apiClient } from "@/common/client";

const chatRoomIdApi = async (productId) => {
  const { data } = await apiClient("/api/chats/room", {
    method: "GET",
    params: { productId },
  });

  return data;
};

const chatMessagesApi = async (chatRoomId) => {
  const { data } = await apiClient(`/api/chats/${chatRoomId}`, {
    method: "GET",
  });

  return data;
};

// export async function updateTradeStatusApi({ tradeId, nextStatus }) {
//   const { data } = await apiClient(`/api/trades/${tradeId}/status`, {
//     method: "PATCH",
//     body: {
//       status: nextStatus,
//     },
//   });

//   return data;
// }
const processTradePendingApi = async (productId, buyerId, callback) => {
  try {
    const { data } = await apiClient(`/api/trades/pending`, {
      method: "POST",
      body: {
        productId,
        buyerId,
      },
    });
    if (!data) {
      throw new ApiError({
        status: 0,
        code: "TRADE_CREATE_FAILED",
        message: "거래 정보를 생성하는 데 실패했습니다.",
      });
    }
    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error(error);
    alert("거래 정보를 생성하는 데 실패했습니다.");
  }
};

const processTradeCompleteApi = async (productId, buyerId, callback) => {
  try {
    const { data } = await apiClient(`/api/trades/complete`, {
      method: "POST",
      body: {
        productId,
        buyerId,
      },
    });
    if (!data) {
      throw new ApiError({
        status: 0,
        code: "TRADE_CREATE_FAILED",
        message: "거래 정보를 생성하는 데 실패했습니다.",
      });
    }
    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error(error);
    alert("거래 정보를 생성하는 데 실패했습니다.");
  }
};

export {
  chatRoomIdApi,
  chatMessagesApi,
  processTradePendingApi,
  processTradeCompleteApi,
};
