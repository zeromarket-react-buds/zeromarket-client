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

  markNotificationChatRoomAsRead: async (chatRoomId) => {
    const { data } = await apiClient(
      `/api/chat-rooms/${chatRoomId}/notifications/read`,
      {
        method: "PATCH",
      }
    );
    return data;
  },

  markReadByRef: async ({ refType, refId, notificationType }) => {
    if (!refType) throw new Error("markReadByRef: refType is required");
    const id = Number(refId);
    if (!id || id <= 0)
      throw new Error("markReadByRef: refId must be a positive number");

    const payload = {
      refType,
      refId: id,
      ...(notificationType ? { notificationType } : {}),
    };

    const { data } = await apiClient("/api/notifications/read/by-ref", {
      method: "PATCH",
      body: payload,
    });

    console.log("data", data);

    return data;
  },

  getNotifications: async () => {
    const { data } = await apiClient("/api/notifications", {
      method: "GET",
    });
    return data;
  },
};
