import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "@/common/api/auth.api";
import Container from "@/components/Container";
import { checkDuplicateIdApi } from "@/common/api/auth.api";
import * as validators from "@/utils/validators";

// 검증 시점
// - 타이핑 중: "형식만" 검사
// - 입력 완료 후: "정확성" 검사
// - 제출 시: 최종 검사

// 이상적인 방식
// - "null/형식"은 실시간
// - 서버 검증(중복 검사)은 debounce
// - submit은 최종

// TODO: 서버 에러 시, 테스트

const SignupPage = () => {
  const navigate = useNavigate();

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
  // status: null | 'error' | 'success'
  const [validation, setValidation] = useState({
    loginId: { status: null, message: "" },
    password: { status: null, message: "" },
    passwordConfirm: { status: null, message: "" },
    name: { status: null, message: "" },
    phone: { status: null, message: "" },
    nickname: { status: null, message: "" },
    email: { status: null, message: "" },
  });

  // 아이디 검증 - 우선순위대로
  const validateId = async (value) => {
    const { isValid, message } = validators.validateId(value);

    // 3순위: 중복 체크 (형식이 맞을 때만 서버 호출)
    if (!isValid) {
      setValidation((prev) => ({
        ...prev,
        loginId: {
          status:
            isValid === true ? "success" : isValid === false ? "error" : null,
          message,
        },
      }));

      return;
    }

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
      console.error(err);

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
    const { isValid, message } = validators.validatePassword(value);

    setValidation((prev) => ({
      ...prev,
      password: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 비밀번호 확인 검증
  const validatePasswordConfirm = (value, password) => {
    const { isValid, message } = validators.validatePasswordConfirm(
      value,
      password
    );

    setValidation((prev) => ({
      ...prev,
      passwordConfirm: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 이름 검증
  const validateName = (value) => {
    const { isValid, message } = validators.validateName(value);

    setValidation((prev) => ({
      ...prev,
      name: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 닉네임 검증
  const validateNickname = (value) => {
    const { isValid, message } = validators.validateName(value);

    setValidation((prev) => ({
      ...prev,
      nickname: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 휴대폰 검증
  const validatePhone = (value) => {
    const { isValid, message } = validators.validatePhone(value);

    setValidation((prev) => ({
      ...prev,
      phone: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 이메일
  const validateEmail = (value) => {
    const { isValid, message } = validators.validateEmail(value);
    // console.log(isValid, message);
    setValidation((prev) => ({
      ...prev,
      email: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        message,
      },
    }));
  };

  // 아이디 입력 시 0.6초(권장) debounce 후 자동 중복 검사
  // - debounce ('입력이 멈췄을 때만 요청'을 보내는 제어 방식)
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
      //   checkDuplicateId(form.loginId);
    }, 600);

    return () => clearTimeout(timer);
  }, [form.loginId]);

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
      } else if (name === "nickname") {
        validateNickname(value);
      } else if (name === "phone") {
        validatePhone(value);
      } else if (name === "email") {
        validateEmail(value);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종 검증
    const { isValid, results } = validators.validateForm(form);

    // TODO: 최종 입력 시 이메일 값이 NULL이면 검증 생략하기
    setValidation((prev) => {
      const next = { ...prev };

      for (const key in next) {
        const { isValid, message } = results[key] || {};

        next[key] = {
          status:
            isValid === true ? "success" : isValid === false ? "error" : "null",
          message: message ?? "",
        };
      }

      return next;
    });
    // <더 안전한 패턴>
    // setValidation((prev) =>
    //   Object.fromEntries(
    //     Object.keys(prev).map((key) => {
    //       const { isValid, message } = results[key] || {};

    //       return [
    //         key,
    //         {
    //           status:
    //             isValid === true
    //               ? "success"
    //               : isValid === false
    //               ? "error"
    //               : null,
    //           message: message ?? "",
    //         },
    //       ];
    //     })
    //   )
    // );

    if (!isValid) {
      alert("입력 정보를 다시 확인해주세요.");
      return;
    }

    // 3) 여기까지 왔으면 최종 submit 가능 (서버 전송)
    console.log("제출 데이터:", form);
    try {
      const { memberId, message } = await registerApi(form);
      // const data = await registerApi(form.id, form.password);
      // console.log(data);
      // alert("회원가입 성공!");

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
      alert("회원가입 성공!");

      // 3-3) 다음 페이지로 유도
      navigate("/login");
    } catch (err) {
      // alert("회원가입 실패");
      // console.error(err.code);
      // console.error(err.message);

      // 3-4) 에러 유형별 분기 처리
      // - 필드별 오류면 -> 해당 input에 직접 표시
      // - 서버 오류면 ->  toast
      switch (err.code) {
        case "LOGINID_ALREADY_EXIST":
          setValidation((prev) => ({
            ...prev,
            loginId: {
              status: "error",
              message: error.message,
            },
          }));
          break;
        case "NICKNAME_ALREADY_EXIST":
          setValidation((prev) => ({
            ...prev,
            nickname: {
              status: "error",
              message: error.message,
            },
          }));
          break;
        case "PHONE_ALREADY_EXIST":
          setValidation((prev) => ({
            ...prev,
            phone: {
              status: "error",
              message: error.message,
            },
          }));
          break;
        case "EMAIL_ALREADY_EXIST":
          setValidation((prev) => ({
            ...prev,
            email: {
              status: "error",
              message: error.message,
            },
          }));
          break;
        default:
          // TODO: toast로 변경
          alert(err.message || "회원가입에 실패했습니다.");
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
        <div className="bg-pink-200">
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
          <div>
            <label className="block text-base mb-1">비밀번호</label>
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

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-base mb-1">비밀번호 확인</label>
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
                className={`text-sm mt-1 ${
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
