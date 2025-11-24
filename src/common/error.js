export class ApiError extends Error {
  constructor({ status, code, message }) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function handleApiError(response) {
  let data = null;

  try {
    data = await response.clone().json();
  } catch {
    throw new ApiError({
      status: response.status,
      code: "UNKNOWN_ERROR",
      message: "서버 응답을 해석할 수 없습니다.",
    });
  }

  throw new ApiError({
    status: response.status,
    code: data.code || "UNKNOWN_ERROR",
    message: data.message || "요청 처리 중 오류가 발생했습니다.",
  });
}

// 실무에서 자주 쓰는 패턴 (최종 형태 예시)
export function createApiError(response, data) {
  return new ApiError({
    status: response.status,
    code: data?.code || "UNKNOWN_ERROR",
    message: data?.message || "요청 중 오류 발생",
  });
}

// 에러를 ‘통일된 방식으로 다루기 위한 규칙’을 정의하는 곳

// - 서버 에러 응답 파싱
// - 상태 코드별 분기
// - 통일된 에러 객체 생성

// 1. error.js : 에러 형태 통일
// 2. client.js : 에러 발생 감지
// 3. component : 에러 처리 UI
