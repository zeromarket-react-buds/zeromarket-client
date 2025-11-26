// 기본 API 경로
const BASE_URL = "http://localhost:8080/api";

/**
 * fetch 응답이 성공적인지 확인하고 JSON 데이터를 반환합니다.
 * 실패 시, 에러 메시지를 포함하여 throw 합니다.
 */
const handleResponse = async function (response) {
  if (!response.ok) {
    // API 에러 상세 정보를 포함하거나, 간단히 상태 코드를 반환합니다.
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${
        errorBody.message || "Unknown error"
      }`
    );
  }
  return response.json();
};

// 전체 게시물 목록 조회
const getBoards = async function () {
  const response = await fetch(`${BASE_URL}/boards`);
  return handleResponse(response);
};

// 특정 게시물 상세 조회
const getBoardById = async function (id) {
  if (!id) {
    throw new Error("Board ID is required");
  }
  const response = await fetch(`${BASE_URL}/boards/${id}`);
  return handleResponse(response);
};

// ... 기존 getBoards, getBoardById 함수 이후에 추가

// 게시물 생성 (POST)
const createBoard = async function (boardData) {
  const response = await fetch(`${BASE_URL}/boards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boardData),
  });
  return handleResponse(response);
};

// 게시물 수정 (PUT 또는 PATCH) - 여기서는 PUT을 사용
const updateBoard = async function (id, boardData) {
  if (!id) {
    throw new Error("Board ID is required for update");
  }
  const response = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(boardData),
  });
  // PUT 요청의 경우, 백엔드에서 응답 본문이 없을 수 있으므로 빈 응답 처리
  if (response.status === 204) return {}; // No Content
  return handleResponse(response);
};

// 게시물 삭제 (DELETE)
const deleteBoard = async function (id) {
  if (!id) {
    throw new Error("Board ID is required for delete");
  }
  const response = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "DELETE",
  });
  // DELETE 요청의 경우, 백엔드에서 응답 본문이 없을 수 있으므로 빈 응답 처리
  if (response.status === 204) return {}; // No Content
  // DELETE 요청도 응답 본문이 있을 경우 handleResponse 사용 가능
  if (response.status !== 204 && response.ok) return {}; // 성공적인 응답이지만 No Content가 아닐 경우
  return handleResponse(response);
};

export { getBoards, getBoardById, createBoard, updateBoard, deleteBoard };
