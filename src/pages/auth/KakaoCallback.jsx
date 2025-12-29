import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import Container from "@/components/Container";
import { useModal } from "@/hooks/useModal";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { oauthLogin, linkKakaoAccount, isAuthenticated } = useAuth();
  const { alert } = useModal();
  const handledRef = useRef(false);

  // (첫 렌더(로그인 여부 false)와 이후 isAuthenticated 값이 바뀔 때마다 다시 실행될 수 있습니다.)
  // useEffect가 한 번만 실행되도록 handledRef로 가드
  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

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
          await alert({ description: "카카오 계정이 연동되었습니다." });
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
