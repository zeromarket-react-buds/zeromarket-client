import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";
import { loginApi } from "@/common/api/auth.api";
import { ApiError } from "@/common/error";
import Container from "@/components/Container";

// TODO: UI 통일성 반영하기 (index.css)
// TODO: 자동 로그인 ON/OFF
// TODO: 비밀번호 보기

function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    rememberMe: false,
  });
  // status: null | "error" | "success"
  const [validation, setValidation] = useState({
    loginId: { status: null, message: "" },
    password: { status: null, message: "" },
  });
  const [commonError, setCommonError] = useState("");
  const idRef = useRef(null);

  const navigate = useNavigate();

  const validateField = (field, value) => {
    const errorMessage =
      field === "loginId"
        ? "아이디를 입력해주세요."
        : field === "password"
        ? "비밀번호를 입력해주세요."
        : "";

    if (!value || !value.trim()) {
      return { status: "error", message: errorMessage };
    }
    return { status: "success", message: "" };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 실시간 검증(validation state, ui 반영하기)
    const { status, message } = validateField(name, value);
    setValidation((prev) => ({
      ...prev,
      [name]: { status, message },
    }));

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateAll = (id, pw) => {
    // 널 검사
    const idResult = validateField("loginId", id);
    const pwResult = validateField("password", pw);

    // 총 결과 반환
    return {
      isValid: idResult.status === "success" && pwResult.status === "success",
      results: { loginId: idResult, password: pwResult },
    };
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const { isValid, results } = validateAll(form.loginId, form.password);

    // validation(상태, UI)에 검사 결과 반영하기
    setValidation(results);

    if (!isValid) {
      console.error("아이디 또는 비밀번호를 작성 안하셨네요!");
      return;
    }

    // 검사 성공 -> 서버 요청
    try {
      // TODO: AuthContext.login 으로 변경하기 (토큰 저장, 인증 객체 등록(프론트) 해줌)
      await login(form.loginId, form.password);

      // 원하는 페이지로 이동
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError) {
        // 1. input border 색 변경
        setValidation({
          loginId: { status: "error", message: "" },
          password: { status: "error", message: "" },
        });

        // 2. 상단 공통 에러 메시지 표시
        setCommonError(err.message);

        // 3. focus 이동
        idRef.current.focus();
      }
    }
  }

  const getInputClassName = (field) => {
    const base =
      "w-full border rounded-md px-3 py-2 focus:outline-none focus:border-green-600 transition-colors";
    if (validation[field].status === "error") {
      return `${base} border-red-500 focus:border-red-500`;
    }
    if (validation[field].status === "success") {
      return `${base} border-green-500 focus:border-green-500`;
    }
    return `${base} border-gray-300 focus:border-blue-500`;
    // return base;
  };

  // oauth 화면 이동
  const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const loginWithKakao = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="src/assets/zm_logo.svg"
            alt="logo"
            className=" w-60 h-auto"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 공통 에러 메시지 */}
            {commonError && (
              <div className="text-sm text-red-500">{commonError}</div>
            )}

            {/* 로그인 상태 유지 */}
            {/* <div className="inline-flex items-center text-sm text-gray-700"></div> */}

            {/* 아이디 인풋 */}
            <div>
              <label className="block text-base mb-1">아이디</label>
              <input
                type="text"
                name="loginId"
                placeholder="아이디"
                value={form.loginId}
                onChange={handleChange}
                className={getInputClassName("loginId")}
                ref={idRef}
              />
              {validation.loginId.message && (
                <p
                  className={`text-sm mt-1 ${
                    validation.loginId.status === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {validation.loginId.message}
                </p>
              )}
            </div>

            {/* 비밀번호 인풋 */}
            <div>
              <label className="block text-base mb-1">비밀번호</label>
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                className={getInputClassName("password")}
              />
              {validation.password.message && (
                <p
                  className={`text-sm mt-1 ${
                    validation.password.status === "success"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {validation.password.message}
                </p>
              )}
            </div>

            {/* 아이디/비밀번호 찾기 */}
            <div className="flex justify-center gap-2">
              <span className="text-sm text-gray-400 cursor-pointer">
                아이디 찾기
              </span>
              <span className="w-0 h-5 border border-gray-400"></span>
              <span className="text-sm text-gray-400 cursor-pointer">
                비밀번호 찾기
              </span>
            </div>

            {/* 로그인 */}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-3 rounded-md font-semibold cursor-pointer"
            >
              로그인
            </button>

            {/* 비회원으로 둘러보기 */}
            <div
              onClick={() => {
                navigate("/");
              }}
              className="text-center text-sm text-gray-400 cursor-pointer"
            >
              비회원으로 둘러보기
            </div>
          </div>
        </form>

        {/* Social login */}
        <div className="space-y-6">
          {/* 헤더 */}
          <div className="flex justify-center items-center gap-6">
            <span className="flex-grow border-t border-gray-400"></span>
            <span className="text-sm text-gray-400">간편 로그인</span>
            <span className="flex-grow border-t border-gray-400"></span>
          </div>

          <div className="space-y-6">
            <button
              onClick={loginWithKakao}
              className="w-full flex items-center justify-center border rounded-md py-2 cursor-pointer"
            >
              <div className="w-4 h-4 bg-yellow-400 rounded-full mr-2" />
              카카오톡으로 로그인
            </button>

            <button className="w-full flex items-center justify-center border rounded-md py-2 cursor-pointer">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
              네이버로 로그인
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
