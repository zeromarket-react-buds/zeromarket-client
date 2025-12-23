import { apiClient } from "@/common/client";

export async function boardsApi(currentPage) {
  const { data } = await apiClient("/api/boards", {
    method: "GET",
    body: { currentPage },
  });

  return data; // { accessToken, refreshToken }
}
