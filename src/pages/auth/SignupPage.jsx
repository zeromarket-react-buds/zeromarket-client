import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/common/api/auth.api";
import Container from "@/components/Container";
import { checkDuplicateIdApi } from "@/common/api/auth.api";
import { Eye, EyeOff } from "lucide-react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { toast } from "react-toastify";

// 검증 시점
// - 타이핑 중: "형식만" 검사
// - 입력 완료 후: "정확성" 검사
// - 제출 시: 최종 검사

// 이상적인 방식
// - "null/형식"은 실시간
// - 서버 검증(중복 검사)은 debounce
// - submit은 최종

const SignupPage = () => {
  const navigate = useNavigate();

  const initialForm = {
    loginId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    phone: "",
    nickname: "",
  };
  const {
    form,
    validation,
    handleChange,
    validateAll,
    setForm,
    updateValidation,
  } = useFormValidation(initialForm, checkDuplicateIdApi);

  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 전체 검증
    const isValid = await validateAll();

    if (!isValid) {
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    // 3) 여기까지 왔으면 최종 submit 가능 (서버 전송)
    try {
      const { memberId, message } = await registerApi(form);

      // 3-1) 폼 상태 초기화
      setForm({
        loginId: "",
        password: "",
        passwordConfirm: "",
        name: "",
        email: "",
        phone: "",
        nickname: "",
      });

      // 3-2) 성공 메시지 노출
      // TODO: toast로 변경
      toast.success("회원가입 성공!");
      // alert("회원가입 성공!");

      // 3-3) 다음 페이지로 유도
      navigate("/login");
    } catch (error) {
      const { code, message } = error;

      // 3-4) 에러 유형별 분기 처리
      // - 필드별 오류면 -> 해당 input에 직접 표시
      // - 서버 오류면 ->  toast
      switch (code) {
        case "LOGINID_ALREADY_EXIST":
          updateValidation("loginId", false, message);
          break;
        case "NICKNAME_ALREADY_EXIST":
          updateValidation("nickname", false, message);
          break;
        case "PHONE_ALREADY_EXIST":
          updateValidation("phone", false, message);
          break;
        case "EMAIL_ALREADY_EXIST":
          updateValidation("email", false, message);
          break;
        default:
          // TODO: toast로 변경
          toast.info(message || "회원가입에 실패했습니다.");
          // alert(message || "회원가입에 실패했습니다.");
          break;
      }
    }
  };

  // 공통 input 스타일 함수
  const getInputClassName = (field) => {
    const base = "w-full border rounded-md p-2 transition-colors";
    if (validation[field].status === "error")
      return `${base} border-red-500 focus:border-red-500`;
    if (validation[field].status === "success")
      return `${base} border-green-500 focus:border-green-500`;
    return `${base} border-gray-300 focus:border-blue-500`;
  };

  return (
    <Container>
      <div className="flex flex-col gap-12">
        {/* banner */}
        <div>
          <p className="text-2xl mb-6">
            나만의 가게를
            <br />
            만들어 볼까요?
          </p>
          <p className="text-sm">먼저 회원가입이 필요해요 :)</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이디 */}
          <div>
            <label className="block text-base mb-1">아이디</label>
            <input
              name="loginId"
              value={form.loginId}
              onChange={handleChange}
              className={getInputClassName("loginId")}
              placeholder="영문+숫자 6~12자"
            />
            {/* 에러 메시지 */}
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
            {/* <p className="text-xs text-red-500 mt-1">영문, 숫자 포함 6~12자</p> */}
          </div>

          {/* 비밀번호 */}
          <div className="relative">
            <label className="block text-base mb-1">비밀번호</label>
            <input
              type={show ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className={getInputClassName("password")}
              placeholder="영문+숫자 포함 8자 이상"
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
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-1 top-1"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 비밀번호 확인 */}
          <div className="relative">
            <label className="block text-base mb-1">비밀번호 확인</label>
            <input
              type={showConfirm ? "text" : "password"}
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={getInputClassName("passwordConfirm")}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {validation.passwordConfirm.message && (
              <p
                className={`text-sm mt-1 ${
                  validation.passwordConfirm.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.passwordConfirm.message}
              </p>
            )}
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-1 top-1"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-base mb-1">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={getInputClassName("name")}
              placeholder="이름"
            />
            {validation.name.message && (
              <p className="text-sm mt-1 text-red-500">
                {validation.name.message}
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-base mb-1">닉네임</label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className={getInputClassName("nickname")}
              placeholder="닉네임"
            />
            {validation.nickname.message && (
              <p className="text-sm mt-1 text-red-500">
                {validation.nickname.message}
              </p>
            )}
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <label className="block text-base mb-1">휴대폰 번호</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={getInputClassName("phone")}
              placeholder="010-0000-0000"
            />
            {validation.phone.message && (
              <p
                className={`text-sm mt-1 ${
                  validation.phone.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.phone.message}
              </p>
            )}
          </div>

          {/* 이메일 (선택)*/}
          <div>
            <label className="block text-base mb-1">이메일 (선택)</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className={getInputClassName("email")}
              // className="w-full border rounded-md p-2"
              placeholder="example@email.com"
            />
            {validation.email.message && (
              <p
                className={`text-sm mt-1 ${
                  validation.email.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.email.message}
              </p>
            )}
          </div>

          <div className="text-sm text-gray-500 leading-relaxed">
            가입 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-md font-semibold"
          >
            회원가입
          </button>
        </form>

        {/* OAuth 2.0 */}
        <div className="space-y-12">
          <div className="flex gap-2 justify-center items-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <h2 className="text-sm text-gray-500">간편 회원가입</h2>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          <div className="space-y-6">
            <button className="w-full border rounded-md p-2 flex justify-center items-center gap-5 cursor-pointer">
              <div className="bg-yellow-300 w-10 h-10 rounded-md flex justify-center items-center text-2xl font-bold">
                K
              </div>
              <div>카카오톡으로 회원가입</div>
            </button>
            <button className="w-full border rounded-md p-2 flex justify-center items-center gap-5 cursor-pointer">
              <div className="bg-green-500 w-10 h-10 rounded-md flex justify-center items-center text-2xl font-bold">
                N
              </div>
              <div>네이버로 회원가입</div>
            </button>
          </div>
          <div className="text-sm text-gray-500 leading-relaxed">
            가입 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SignupPage;
