import { createContext, useContext, useState, useEffect } from "react";
import {
  getMyInfoApi,
  loginApi,
  logoutApi,
  oauthLoginApi,
  withdrawApi,
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

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  // ✅ 앱 시작(로드) 시 로그인 상태 복구
  useEffect(() => {
    async function initAuth() {
      try {
        await refreshAccessToken();

        const userData = await getMyInfoApi();

        setUser(userData);

        console.log("초기 인증 복구 성공");
      } catch (e) {
        setUser(null);

        console.log("초기 인증 복구 실패", e);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  // ✅ 로그인
  async function login(loginId, password) {
    const data = await loginApi(loginId, password);

    // 1) 토큰 저장
    localStorage.setItem("accessToken", data.accessToken);

    // 2) 사용자 정보 조회
    const userData = await getMyInfoApi();

    // 2) 전역 상태 갱신
    setUser(userData);
  }

  // ✅ 로그아웃
  async function logout() {
    const data = await logoutApi();

    localStorage.removeItem("accessToken");

    setUser(null);

    console.log("로그아웃: ", data);
  }

  // ✅ OAuth 로그인
  const oauthLogin = async (code) => {
    const data = await oauthLoginApi(code);

    // 1) 로컬 스토리지 저장
    localStorage.setItem("accessToken", data.accessToken);

    // 2) 사용자 정보 조회
    const userData = await getMyInfoApi();

    // 3) 전역 상태 갱신
    setUser(userData);
  };

  // ✅ 회원탈퇴
  const withdraw = async (payload) => {
    await withdrawApi(payload);

    localStorage.removeItem("accessToken");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        oauthLogin,
        logout,
        withdraw,
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
