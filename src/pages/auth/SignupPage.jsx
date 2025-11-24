import { useState } from "react";
// import { registerApi } from "@/api/auth";

// 붙여넣은 내용 수정하는 중...

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    // try {
    //   const res = await registerApi(email, password);
    //   alert("회원가입 성공!");
    // } catch (err) {
    //   alert("회원가입 실패");
    //   console.error(err);
    // }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
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

      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignupPage;
