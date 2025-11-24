import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
import { loginApi } from "@/common/api/auth.api";
import { ApiError } from "@/common/error";

function LoginPage() {
  //   const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = await loginApi(email, password);
      console.log(data);

      alert("로그인 성공");
      // 원하는 페이지로 이동
      // navigate("/users/me");
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(err);
        console.log(err.code); // TOKEN_EXPIRED, AUTH_FAILED 등
        console.log(err.message); // 사용자에게 보여줄 문구
        alert("로그인 실패");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="이메일 입력"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호 입력"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">로그인</button>
    </form>
  );
}

export default LoginPage;
