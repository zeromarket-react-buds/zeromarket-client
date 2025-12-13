import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import Container from "@/components/Container";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const { oauthLogin } = useAuth();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      console.log("code 없음");
      return;
    }

    const runOauthLogin = async () => {
      try {
        await oauthLogin(code);
        console.log("카카오 로그인 성공");
        navigate("/");
      } catch (e) {
        console.error("카카오 로그인 실패", e);
        navigate("/login");
      }
    };

    runOauthLogin();
  }, []);

  return (
    <Container>
      <div>로그인 처리 중...</div>
    </Container>
  );
};

export default KakaoCallback;
