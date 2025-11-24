let isRefreshing = false;
let refreshPromise = null;
const API_BASE = "http://localhost:18080";

export function handleLogout() {
  localStorage.clear();
}

export async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const { accessToken, refreshToken: newRT } = await res.json();

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRT);

      return accessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
