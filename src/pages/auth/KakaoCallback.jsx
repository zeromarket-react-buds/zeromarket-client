import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import Container from "@/components/Container";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { oauthLogin, linkKakaoAccount, isAuthenticated } = useAuth();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const redirectUri =
      import.meta.env.VITE_KAKAO_REDIRECT_URI ||
      `${window.location.origin}/oauth/kakao/callback`;

    if (!code) {
      console.log("code 없음");
      navigate("/login");
      return;
    }

    const runOauth = async () => {
      try {
        if (isAuthenticated) {
          await linkKakaoAccount(code, redirectUri);
          alert("카카오 계정이 연동되었습니다.");
          navigate("/me");
        } else {
          await oauthLogin(code);
          navigate("/");
        }
      } catch (e) {
        console.error("카카오 처리 실패", e);
        navigate("/login");
      }
    };

    runOauth();
  }, [isAuthenticated, linkKakaoAccount, navigate, oauthLogin]);

  return (
    <Container>
      <div>카카오 인증 처리 중...</div>
    </Container>
  );
};

export default KakaoCallback;
