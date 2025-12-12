import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/common/client";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("KakaoCallback mounted");

    const code = new URL(window.location.href).searchParams.get("code");
    console.log("kakao code:", code);

    if (!code) {
      console.log("code 없음");
      return;
    }

    apiClient("/api/oauth/kakao", {
      method: "POST",
      body: { code },
    })
      .then(() => {
        console.log("카카오 로그인 성공");
        navigate("/");
      })
      .catch((e) => {
        console.error("카카오 로그인 실패", e);
        navigate("/login");
      });
  }, []);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallback;
