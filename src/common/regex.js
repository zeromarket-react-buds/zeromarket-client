// src/constants/regex.js

/**
 * 정규식 패턴 모음
 * - 프로젝트 전체에서 재사용 가능
 * - 한 곳에서 관리하여 유지보수 용이
 */

// ==================== 회원가입 관련 ====================

/**
 * 아이디 정규식
 * - 영문 대소문자, 숫자만 허용
 * - 6~12자
 */
export const ID_REGEX = /^[a-zA-Z0-9]{6,12}$/;

/**
 * 비밀번호 정규식
 * - 영문자 최소 1개 이상 포함
 * - 숫자 최소 1개 이상 포함
 */
export const PASSWORD_CONTAINS_LETTER_AND_NUMBER = /(?=.*[A-Za-z])(?=.*\d)/;

/**
 * 비밀번호 강도 (중)
 * - 영문자 + 숫자 포함
 * - 8자 이상
 */
export const PASSWORD_MEDIUM = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

/**
 * 비밀번호 강도 (강)
 * - 영문 대문자 + 소문자 + 숫자 + 특수문자 포함
 * - 8자 이상
 */
export const PASSWORD_STRONG =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

/**
 * 이름 정규식
 * - 한글만 허용
 * - 2~5자
 */
export const NAME_KOREAN = /^[가-힣]{2,5}$/;

/**
 * 이름 정규식 (한글/영문)
 * - 한글 또는 영문만 허용
 * - 2~20자
 */
export const NAME_KOREAN_OR_ENGLISH = /^[가-힣a-zA-Z]{2,20}$/;

/**
 * 닉네임 정규식
 * - 한글, 영문, 숫자 허용
 * - 2~10자
 */
export const NICKNAME = /^[가-힣a-zA-Z0-9]{2,10}$/;

// ==================== 연락처 관련 ====================

/**
 * 휴대폰 번호 (하이픈 포함)
 * - 010-0000-0000 형식
 */
export const PHONE_WITH_HYPHEN = /^010-\d{4}-\d{4}$/;

/**
 * 휴대폰 번호 (하이픈 없음)
 * - 01000000000 형식
 */
export const PHONE_WITHOUT_HYPHEN = /^010\d{8}$/;

/**
 * 휴대폰 번호 (하이픈 있거나 없거나)
 * - 010-0000-0000 또는 01000000000
 */
export const PHONE_FLEXIBLE = /^010-?\d{4}-?\d{4}$/;

/**
 * 일반 전화번호
 * - 02-000-0000 또는 031-000-0000 형식
 */
export const PHONE_LANDLINE = /^0\d{1,2}-\d{3,4}-\d{4}$/;

// ==================== 이메일 관련 ====================

/**
 * 이메일 (기본)
 * - example@domain.com 형식
 */
export const EMAIL = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * 이메일 (엄격한 검증)
 * - RFC 5322 표준에 가까운 검증
 */
export const EMAIL_STRICT =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// ==================== 날짜/시간 관련 ====================

/**
 * 날짜 (YYYY-MM-DD)
 * - 2024-01-01 형식
 */
export const DATE_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * 날짜 (YYYY.MM.DD)
 * - 2024.01.01 형식
 */
export const DATE_YYYY_MM_DD_DOT = /^\d{4}\.\d{2}\.\d{2}$/;

/**
 * 시간 (HH:MM)
 * - 13:30 형식
 */
export const TIME_HH_MM = /^([01]\d|2[0-3]):([0-5]\d)$/;

// ==================== 사업자/주민등록번호 관련 ====================

/**
 * 사업자 등록번호
 * - 000-00-00000 형식
 */
export const BUSINESS_NUMBER = /^\d{3}-\d{2}-\d{5}$/;

/**
 * 주민등록번호
 * - 000000-0000000 형식
 */
export const RESIDENT_NUMBER = /^\d{6}-\d{7}$/;

// ==================== 카드/은행 관련 ====================

/**
 * 신용카드 번호 (하이픈 포함)
 * - 0000-0000-0000-0000 형식
 */
export const CARD_NUMBER = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

/**
 * 계좌번호 (기본)
 * - 숫자만 10~14자
 */
export const ACCOUNT_NUMBER = /^\d{10,14}$/;

// ==================== URL 관련 ====================

/**
 * URL (http/https)
 * - http://example.com 또는 https://example.com
 */
export const URL_HTTP =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * 유튜브 URL
 * - https://www.youtube.com/watch?v=...
 * - https://youtu.be/...
 */
export const YOUTUBE_URL =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

// ==================== 기타 ====================

/**
 * 숫자만
 */
export const ONLY_NUMBER = /^\d+$/;

/**
 * 영문만
 */
export const ONLY_ENGLISH = /^[a-zA-Z]+$/;

/**
 * 한글만
 */
export const ONLY_KOREAN = /^[가-힣]+$/;

/**
 * 공백 제거용
 */
export const WHITESPACE = /\s/g;

/**
 * 특수문자 포함 여부
 */
export const HAS_SPECIAL_CHAR = /[!@#$%^&*(),.?":{}|<>]/;

// ==================== 유틸리티 함수 ====================

/**
 * 정규식 테스트 헬퍼
 * @param {RegExp} regex - 정규식
 * @param {string} value - 검사할 문자열
 * @returns {boolean}
 */
export const testRegex = (regex, value) => {
  if (!value) return false;
  return regex.test(value);
};

/**
 * 하이픈 자동 삽입 (휴대폰 번호)
 * @param {string} value - 숫자만 있는 문자열
 * @returns {string} - 010-0000-0000 형식
 */
export const formatPhoneNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11
  )}`;
};

/**
 * 하이픈 자동 삽입 (사업자 등록번호)
 * @param {string} value - 숫자만 있는 문자열
 * @returns {string} - 000-00-00000 형식
 */
export const formatBusinessNumber = (value) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
    5,
    10
  )}`;
};
