import { useState, useEffect, useCallback } from "react";
import * as validators from "@/utils/validators";

/**
 * 폼 유효성 검증 커스텀 훅
 * @param {Object} initialForm  - 초기 폼 데이터
 * @param {Function} checkDuplicateIdApi - 아이디 중복 체크 API 함수
 * @returns
 */
const useFormValidation = (initialForm, checkDuplicateIdApi) => {
  const [form, setForm] = useState(initialForm);

  const [validation, setValidation] = useState({
    loginId: { status: null, message: "" },
    password: { status: null, message: "" },
    passwordConfirm: { status: null, message: "" },
    name: { status: null, message: "" },
    phone: { status: null, message: "" },
    nickname: { status: null, message: "" },
    email: { status: null, message: "" },
  });

  // validation(검증 상태) 업데이트 헬퍼
  const updateValidation = useCallback((field, isValid, message = "") => {
    setValidation((prev) => ({
      ...prev,
      [field]: {
        status:
          isValid === true ? "success" : isValid === false ? "error" : null,
        // status: message ? (isValid ? "success" : "error") : null,
        message,
      },
    }));
  }, []);

  // ✅ loginId 형식 + 중복 검사
  const validateLoginIdWithDuplicate = useCallback(
    async (value) => {
      // 1단계: 형식 검증
      const formatResult = validators.validateId(value);

      if (!formatResult.isValid) {
        updateValidation("loginId", false, formatResult.message);
        return false;
      }

      // 2단계: 중복 체크
      try {
        const data = await checkDuplicateIdApi(value);

        if (data.existsByLoginId) {
          updateValidation("loginId", false, "이미 사용 중인 아이디입니다.");
          return false;
        } else {
          updateValidation("loginId", true, "사용 가능한 아이디입니다.");
          return true;
        }
      } catch {
        updateValidation("loginId", false, "중복 확인 중 오류가 발생했습니다.");
        return false;
      }
    },
    [checkDuplicateIdApi, updateValidation]
  );

  // 필드별 검증 실행
  const validateField = useCallback(
    (field, value, password = null) => {
      let result;

      switch (field) {
        case "password":
          result = validators.validatePassword(value);
          break;
        case "passwordConfirm":
          result = validators.validatePasswordConfirm(value, password);
          break;
        case "name":
          result = validators.validateName(value);
          break;
        case "phone":
          result = validators.validatePhone(value);
          break;
        case "nickname":
          result = validators.validateNickname(value);
          break;
        case "email":
          result = validators.validateEmail(value);
          break;
        default:
          return;
      }

      updateValidation(field, result.isValid, result.message);
    },
    [updateValidation]
  );

  // 폼 입력 핸들러
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setForm((prev) => {
        const updated = { ...prev, [name]: value };

        // 실시간 기본 검증 (loginId 제외)
        if (name !== "loginId") {
          const password = name === "passwordConfirm" ? updated.password : null;
          validateField(name, value, password);

          if (name === "password" && updated.passwordConfirm) {
            validateField("passwordConfirm", updated.passwordConfirm, value);
          }
        }

        return updated;
      });
    },
    [validateField]
  );

  // ✅ 아이디 debounce 중복검사
  useEffect(() => {
    if (form.loginId.length < 4) {
      setValidation((prev) => ({
        ...prev,
        loginId: { status: null, message: "" },
      }));
      return;
    }

    const timer = setTimeout(() => {
      validateLoginIdWithDuplicate(form.loginId);
    }, 600);

    return () => clearTimeout(timer);
  }, [form.loginId, validateLoginIdWithDuplicate]);

  // 전체 폼 검증 (제출 시)
  const validateAll = useCallback(async () => {
    const loginIdValid = await validateLoginIdWithDuplicate(form.loginId);

    validateField("password", form.password);
    validateField("passwordConfirm", form.passwordConfirm, form.password);
    validateField("name", form.name);
    validateField("phone", form.phone);
    validateField("nickname", form.nickname);
    validateField("email", form.email);

    const allValid =
      loginIdValid &&
      Object.entries(validation).every(
        ([key, val]) => key === "loginId" || val.status !== "error"
      );

    return allValid;
  }, [form, validation, validateLoginIdWithDuplicate, validateField]);

  return {
    form,
    validation,
    handleChange,
    validateAll,
    setForm,
    updateValidation,
  };
};

export { useFormValidation };
