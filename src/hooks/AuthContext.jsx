import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, loginApi } from "@/common/api/auth.api";

/*
전역으로 관리할 상태 
- user
- isAuthenticated
- login()
- logout()
- loading : 인증상태 초기화 중 여부 
*/

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // ✅ 앱 시작(로드) 시 로그인 상태 복구
  useEffect(() => {
    async function initAuth() {
      try {
        const res = await refreshTokenApi(refreshToken);
        localStorage.setItem("accessToken", res.accessToken);
        localStorage.setItem("refreshToken", res.refreshToken);

        const userData = await getMyInfo();
        setUser(userData);
        console.log("초기 인증 복구 성공");
      } catch {
        setUser(null);
        console.error("초기 인증 복구 실패", e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // ✅ 로그인
  async function login(loginId, password) {
    const data = await loginApi(loginId, password);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    const userData = await getMyInfo();
    setUser(userData);
  }

  // ✅ 로그아웃
  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = function useAuth() {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
