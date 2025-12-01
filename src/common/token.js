let isRefreshing = false;
let refreshPromise = null;
const API_BASE = "http://localhost:8080";

// TODO: 쿠키로 refresh token flow 구현

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
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 쿠키 전달
        body: null,
        // body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const { accessToken } = await res.json();

      if (!accessToken) {
        throw new Error("Server did not return accessToken");
      }

      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
