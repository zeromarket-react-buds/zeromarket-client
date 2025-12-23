import { apiClient } from "@/common/client";

const getKeywordsApi = async () => {
  const { data } = await apiClient("/api/keywords", {
    method: "GET",
  });

  return data;
};

const getKeywordApi = async (alertId) => {
  const { data } = await apiClient(`/api/keywords/${alertId}`, {
    method: "GET",
  });

  return data;
};

const createKeywordsApi = async (keywordAlert) => {
  const { data } = await apiClient("/api/keywords", {
    method: "POST",
    params: keywordAlert,
  });

  return data;
};

const updateKeywordsApi = async (keywordAlert) => {
  const { data } = await apiClient("/api/keywords", {
    method: "PUT",
    params: keywordAlert,
  });

  return data;
};

const deleteKeywordsApi = async (alertId) => {
  const { data } = await apiClient(`/api/keywords/${alertId}`, {
    method: "DELETE",
  });

  return data;
};

export {
  getKeywordsApi,
  getKeywordApi,
  createKeywordsApi,
  updateKeywordsApi,
  deleteKeywordsApi,
};
