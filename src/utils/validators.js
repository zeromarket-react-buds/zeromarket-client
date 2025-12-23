import {
  ID_REGEX,
  PASSWORD_CONTAINS_LETTER_AND_NUMBER,
  PHONE_WITH_HYPHEN,
  EMAIL,
  NICKNAME,
  PHONE_WITHOUT_HYPHEN,
} from "@/common/regex";

/**
 * 검증 결과 객체 생성 헬퍼
 */
const createValidationResult = (isValid, message = "") => ({
  isValid,
  message,
});

/**
 * 아이디 검증
 * - 6~12자
 * - 영문, 숫자만 허용
 */
export const validateId = (value) => {
  if (!value || !value.trim()) {
    return createValidationResult(false, "아이디를 입력해주세요.");
  }

  if (!ID_REGEX.test(value)) {
    return createValidationResult(false, "영문+숫자 6~12자로 입력해주세요.");
  }

  return createValidationResult(true);
};

/**
 * 비밀번호 검증
 * - 8자 이상
 * - 영문, 숫자 포함
 */
export const validatePassword = (value) => {
  if (!value || !value.trim()) {
    return createValidationResult(false, "비밀번호를 입력해주세요.");
  }

  if (value.length < 8) {
    return createValidationResult(false, "8자 이상 입력해주세요.");
  }

  if (!ID_REGEX.test(value)) {
    return createValidationResult(false, "영문+숫자를 포함해주세요.");
  }

  return createValidationResult(true, "사용 가능한 비밀번호입니다.");
};

/**
 * 비밀번호 확인 검증
 */
export const validatePasswordConfirm = (value, password) => {
  if (!value || !value.trim()) {
    return createValidationResult(false, "");
  }

  if (value !== password) {
    return createValidationResult(false, "비밀번호가 일치하지 않습니다.");
  }

  return createValidationResult(true, "비밀번호가 일치합니다.");
};

/**
 * 이름 검증
 * - 필수값
 */
export const validateName = (value) => {
  if (!value || !value.trim()) {
    return createValidationResult(false, "이름을 입력해주세요.");
  }

  return createValidationResult(true);
};

/**
 * 닉네임 검증
 * - 2~10자
 */
export const validateNickname = (value) => {
  if (!value || !value.trim()) {
    return createValidationResult(false, "닉네임을 입력해주세요.");
  }

  if (value.length < 2 || value.length > 10) {
    return createValidationResult(false, "닉네임은 2~10자로 입력해주세요.");
  }

  return createValidationResult(true);
};

/**
 * 휴대폰 번호 검증
 * - 0100000000(10자), 01000000000(11자) 형식
 */
export const validatePhone = (value) => {
  const trimmedValue = (value ?? "").trim();

  if (!trimmedValue) {
    return createValidationResult(false, "휴대폰 번호를 입력해주세요.");
  }

  const digits = trimmedValue.replace(/\D/g, "");

  if (digits.length !== 10 && digits.length !== 11) {
    return createValidationResult(
      false,
      "휴대폰 번호는 10자리 또는 11자리여야 합니다."
    );
  }

  return createValidationResult(true);
};

/**
 * 이메일 검증
 * - 선택값 (빈 값 허용)
 */
export const validateEmail = (value) => {
  // 선택값이므로 빈 값은 유효
  if (!value || !value.trim()) {
    return createValidationResult(true);
  }

  if (!EMAIL.test(value)) {
    return createValidationResult(false, "올바른 이메일 형식이 아닙니다.");
  }

  return createValidationResult(true);
};

/**
 * 폼 전체 검증 (제출 시 사용)
 */
export const validateForm = (formData) => {
  const results = {
    loginId: validateId(formData.loginId),
    // id: validateId(formData.id),
    password: validatePassword(formData.password),
    passwordConfirm: validatePasswordConfirm(
      formData.passwordConfirm,
      formData.password
    ),
    name: validateName(formData.name),
    nickname: validateNickname(formData.nickname),
    phone: validatePhone(formData.phone),
    email: validateEmail(formData.email),
  };

  const isValid = Object.values(results).every((result) => result.isValid);

  return {
    isValid,
    results,
  };
};
