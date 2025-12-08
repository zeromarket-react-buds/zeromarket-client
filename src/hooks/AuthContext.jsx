import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyInfoApi,
  loginApi,
  // refreshTokenApi,
  logoutApi,
} from "@/common/api/auth.api";
import { refreshAccessToken } from "@/common/token";

/*
전역으로 관리할 상태 
- user
- isAuthenticated
- login()
- logout()
- loading : 인증상태 초기화 중 여부 
*/

// TODO: refreshTokenApi -> refreshAccessToken (token.js) 변경해야 하는지 확인
// TODO: 로그아웃 요청 보내기 (기존: 로컬 스토리지 accessToken 삭제)

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // ✅ 앱 시작(로드) 시 로그인 상태 복구
  useEffect(() => {
    async function initAuth() {
      // const refreshToken = localStorage.getItem("refreshToken");
      // if (!refreshToken) {
      //   setLoading(false); // 로딩 끝 -> 비로그인 상태
      //   return;
      // }

      try {
        await refreshAccessToken();
        // const res = await refreshTokenApi(refreshToken);
        // localStorage.setItem("accessToken", res.accessToken);
        // localStorage.setItem("refreshToken", res.refreshToken);

        const userData = await getMyInfoApi();
        setUser(userData);
        console.log("초기 인증 복구 성공");
      } catch (e) {
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

    // TODO: refresh token --> httpOnly cookie
    // 1) 토큰 저장
    localStorage.setItem("accessToken", data.accessToken);
    // localStorage.setItem("refreshToken", data.refreshToken);

    // 2) 사용자 정보 조회
    const userData = await getMyInfoApi();

    // 2) 전역 상태 갱신
    setUser(userData);
  }

  // ✅ 로그아웃
  async function logout() {
    const data = await logoutApi();
    console.log("로그아웃: ", data);
    localStorage.removeItem("accessToken");
    // localStorage.removeItem("refreshToken");

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
