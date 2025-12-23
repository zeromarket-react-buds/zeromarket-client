import { apiClient } from "@/common/client";

const createReportApi = async (payload) => {
  try {
    const response = await apiClient("/api/reports", {
      method: "POST",
      body: payload,
    });
    return response.data;
  } catch (error) {
    console.error("신고접수 API 에러 발생:", error);
    throw error;
  }
};

const reportReasonApi = async (targetType) => {
  try {
    const query = targetType ? `?targetType=${targetType}` : "";
    const { data } = await apiClient(`/api/reports/reasons${query}`, {
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error("신고사유 API 에러 발생:", error);
    throw error;
  }
};

export { createReportApi, reportReasonApi };
