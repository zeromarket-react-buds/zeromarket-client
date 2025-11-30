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

export { chatRoomIdApi, chatMessagesApi };
