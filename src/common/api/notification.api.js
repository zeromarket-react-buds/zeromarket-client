import { apiClient } from "@/common/client";

export const notificationApi = {
  getUnreadCount: async () => {
    const { data } = await apiClient("/api/notifications/unread-count", {
      method: "GET",
    });
    return data;
  },

  getNotifications: async () => {
    const { data } = await apiClient("/api/notifications", {
      method: "GET",
    });
    return data;
  },

  markAsRead: async (notificationId) => {
    const { data } = await apiClient(
      `/api/notifications/${notificationId}/read`,
      {
        method: "PATCH",
      }
    );
    return data;
  },

  markChatRoomAsRead: async (chatRoomId) => {
    const { data } = await apiClient(
      `/api/chat-rooms/${chatRoomId}/notifications/read`,
      {
        method: "PATCH",
      }
    );
    return data;
  },

  getNotifications: async () => {
    const { data } = await apiClient("/api/notifications", {
      method: "GET",
    });
    return data;
  },
};
