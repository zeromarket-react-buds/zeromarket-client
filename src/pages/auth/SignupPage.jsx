import { useState, useEffect } from "react";
import { registerApi } from "@/common/api/auth.api";
import Container from "@/components/Container";
import { checkDuplicateIdApi } from "@/common/api/auth.api";

// 검증 시점
// - 타이핑 중: "형식만" 검사
// - 입력 완료 후: "정확성" 검사
// - 제출 시: 최종 검사

// 이상적인 방식
// - "null/형식"은 실시간
// - 서버 검증(중복 검사)은 debounce
// - submit은 최종

const SignupPage = () => {
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    passwordConfirm: "",
    name: "",
    email: "",
    phone: "",
    nickname: "",
  });

  // 각 필드별 검증 상태
  // null | 'error' | 'success'
  const [validation, setValidation] = useState({
    loginId: { status: null, message: "" },
    password: { status: null, message: "" },
    passwordConfirm: { status: null, message: "" },
    name: { status: null, message: "" },
    phone: { status: null, message: "" },
    nickname: { status: null, message: "" },
  });

  // 아이디 검증 - 우선순위대로
  const validateId = async (value) => {
    // 1순위: null 체크
    if (!value && !value.trim()) {
      setValidation((prev) => ({
        ...prev,
        loginId: { status: null, message: "" },
      }));
      return false;
    }

    // 2순위: 형식 체크
    if (!/^[a-zA-Z0-9]{6,12}$/.test(value)) {
      setValidation((prev) => ({
        ...prev,
        loginId: {
          status: "error",
          message: "영문+숫자 6~12자로 입력해주세요.",
        },
      }));
      return false;
    }

    // 3순위: 중복 체크 (형식이 맞을 때만 서버 호출)
    try {
      const data = await checkDuplicateIdApi(value);
      if (data.existsByLoginId) {
        setValidation((prev) => ({
          ...prev,
          loginId: { status: "error", message: "이미 사용 중인 아이디입니다." },
        }));
        return false;
      } else {
        // 성공 상태 변경
        setValidation((prev) => ({
          ...prev,
          loginId: { status: "success", message: "사용 가능한 아이디입니다." },
        }));
        return true;
      }
    } catch (err) {
      setValidation((prev) => ({
        ...prev,
        loginId: {
          status: "error",
          message: "중복 확인 중 오류가 발생했습니다.",
        },
      }));
      return false;
    }
  };

  // 비밀번호 검증
  const validatePassword = (value) => {
    // 1순위: null 체크
    if (!value.trim()) {
      setValidation((prev) => ({
        ...prev,
        password: { status: null, message: "" },
      }));
      return false;
    }

    // 2순위: 길이 체크
    if (value.length < 8) {
      setValidation((prev) => ({
        ...prev,
        password: { status: "error", message: "8자 이상 입력해주세요." },
      }));
      return false;
    }

    // 3순위: 형식 체크
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(value)) {
      setValidation((prev) => ({
        ...prev,
        password: { status: "error", message: "영문+숫자를 포함해주세요." },
      }));
      return false;
    }

    // 성공 상태 변경
    setValidation((prev) => ({
      ...prev,
      password: { status: "success", message: "사용 가능한 비밀번호입니다." },
    }));
    return true;
  };

  // 비밀번호 확인 검증
  const validatePasswordConfirm = (value, password) => {
    // 1순위: null 체크
    if (!value.trim()) {
      setValidation((prev) => ({
        ...prev,
        passwordConfirm: { status: null, message: "" },
      }));
      return false;
    }

    // 2순위: 형식 체크
    if (value !== password) {
      setValidation((prev) => ({
        ...prev,
        passwordConfirm: {
          status: "error",
          message: "비밀번호가 일치하지 않습니다.",
        },
      }));
      return false;
    }

    setValidation((prev) => ({
      ...prev,
      passwordConfirm: { status: "success", message: "비밀번호가 일치합니다." },
    }));
    return true;
  };

  // 이름 검증
  const validateName = (value) => {
    if (!value.trim()) {
      setValidation((prev) => ({
        ...prev,
        name: { status: "error", message: "이름을 입력해주세요." },
      }));
      return false;
    }

    setValidation((prev) => ({
      ...prev,
      name: { status: null, message: "" },
    }));
    return true;
  };

  // 휴대폰 검증
  const validatePhone = (value) => {
    if (!value.trim()) {
      setValidation((prev) => ({
        ...prev,
        phone: { status: "error", message: "휴대폰 번호를 입력해주세요." },
      }));
      return false;
    }

    if (!/^010-\d{4}-\d{4}$/.test(value)) {
      setValidation((prev) => ({
        ...prev,
        phone: {
          status: "error",
          message: "010-0000-0000 형식으로 입력해주세요.",
        },
      }));
      return false;
    }

    setValidation((prev) => ({
      ...prev,
      phone: { status: "success", message: "" },
    }));
    return true;
  };

  // // 아이디 중복 체크
  // const checkDuplicateId = async (id) => {
  //   if (!id) return;

  //   const data = await checkDuplicateIdApi(id);

  //   // setErrors((prev) => ({ ...prev, [id]: null }));

  //   if (data.existsByLoginId) {
  //     setIdStatus("error");
  //     setErrors((prev) => ({
  //       ...prev,
  //       loginId: "이미 사용 중인 아이디입니다.",
  //     }));
  //     // setIdMessage("이미 사용 중인 아이디입니다.");
  //   } else {
  //     setIdStatus("success");
  //     setErrors((prev) => ({
  //       ...prev,
  //       loginId: "사용 가능한 아이디입니다.",
  //     }));
  //     // setIdMessage("사용 가능한 아이디입니다.");
  //   }
  // };

  // 아이디 입력 시 0.6초(권장) debounce 후 자동 중복 검사
  // - debounce('입력이 멈췄을 때만 요청'을 보내는 제어 방식)
  // - 입력 도중의 모든 요청을 무시, 최종 입력값으로 한 번만 검사하게 만드는 장치
  // - debounce: 튀는(bounce) 신호를 제거(de)해서 '한 번의 안정된 입력'만 남김
  useEffect(() => {
    if (form.loginId.length < 4) {
      setValidation((prev) => ({
        ...prev,
        loginId: { status: null, message: "" },
      }));
      return;
    }

    const timer = setTimeout(() => {
      validateId(form.loginId);
    }, 600);

    return () => clearTimeout(timer);
    // const timer = setTimeout(() => {
    //   checkDuplicateId(form.loginId);
    // }, 600);

    // return () => clearTimeout(timer);
  }, [form.loginId]);

  // // 비밀번호 일치 검사 (실시간 비교)
  // useEffect(() => {
  //   if (!form.passwordConfirm) {
  //     setPwMatch(null);
  //     return;
  //   }
  //   setPwMatch(form.password === form.passwordConfirm);
  // }, [form.password, form.passwordConfirm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // 실시간 기본 검증 (타이핑 중)
      if (name === "password") {
        validatePassword(value);
        // 비밀번호 변경 시 확인란도 재검증
        if (updated.passwordConfirm) {
          validatePasswordConfirm(updated.passwordConfirm, value);
        }
      } else if (name === "passwordConfirm") {
        validatePasswordConfirm(value, updated.password);
      } else if (name === "name") {
        validateName(value);
      } else if (name === "phone") {
        validatePhone(value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종 검증
    const idValid = await validateId(form.id);
    const pwValid = validatePassword(form.password);
    const pwConfirmValid = validatePasswordConfirm(
      form.passwordConfirm,
      form.password
    );
    const nameValid = validateName(form.name);
    const phoneValid = validatePhone(form.phone);

    if (!idValid || !pwValid || !pwConfirmValid || !nameValid || !phoneValid) {
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    // 3) 여기까지 왔으면 최종 submit 가능 (서버 전송)
    // console.log("제출 데이터:", form);

    try {
      const data = await registerApi(form);
      // const data = await registerApi(form.id, form.password);
      console.log(data);
      alert("회원가입 성공!");
    } catch (err) {
      alert("회원가입 실패");
      console.error(err);
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
      <div className="max-w-md mx-auto bg-green-200 p-6">
        <h1 className="text-xl font-bold mb-2 text-center">회원가입</h1>
        <p className="text-sm text-center text-gray-500 mb-6">
          나만의 가게를 만들어 볼까요?
        </p>
        <p>먼저 회원가입이 필요해요 :)</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 아이디 */}
          <div>
            <label className="block text-sm mb-1">아이디</label>
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
                className={`text-xs mt-1 ${
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
          <div>
            <label className="block text-sm mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={getInputClassName("password")}
              placeholder="영문+숫자 포함 8자 이상"
            />
            {validation.password.message && (
              <p
                className={`text-xs mt-1 ${
                  validation.password.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.password.message}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm mb-1">비밀번호 확인</label>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              className={getInputClassName("passwordConfirm")}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {validation.passwordConfirm.message && (
              <p
                className={`text-xs mt-1 ${
                  validation.passwordConfirm.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.passwordConfirm.message}
              </p>
            )}
            {/* {errors.passwordConfirm ? (
              <p className="text-xs mt-1 text-red-500">
                {errors.passwordConfirm}
              </p>
            ) : (
              pwMatch !== null && (
                <p
                  className={`text-xs mt-1 ${
                    pwMatch ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {pwMatch
                    ? "비밀번호가 일치합니다."
                    : "비밀번호가 일치하지 않습니다."}
                </p>
              )
            )} */}
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm mb-1">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={getInputClassName("name")}
              placeholder="이름"
            />
            {validation.name.message && (
              <p className="text-xs mt-1 text-red-500">
                {validation.name.message}
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm mb-1">닉네임</label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              className={getInputClassName("nickname")}
              placeholder="닉네임"
            />
            {validation.nickname.message && (
              <p className="text-xs mt-1 text-red-500">
                {validation.nickname.message}
              </p>
            )}
          </div>

          {/* 휴대폰 번호 */}
          <div>
            <label className="block text-sm mb-1">휴대폰 번호</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={getInputClassName("phone")}
              placeholder="010-0000-0000"
            />
            {validation.phone.message && (
              <p
                className={`text-xs mt-1 ${
                  validation.phone.status === "success"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {validation.phone.message}
              </p>
            )}
          </div>

          {/* 이메일 (필수값 검사 X)*/}
          <div>
            <label className="block text-sm mb-1">이메일 (선택)</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="example@email.com"
            />
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
            가입 시 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-md font-semibold"
          >
            회원가입
          </button>
        </form>
      </div>
    </Container>
  );
};

export default SignupPage;
