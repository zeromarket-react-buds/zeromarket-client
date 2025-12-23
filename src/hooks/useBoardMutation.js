import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoard, updateBoard, deleteBoard } from "@/common/sample_api";

/**
 * 게시물 생성용 훅
 * @param {function} onSuccessCallback - 성공 시 실행할 추가 콜백
 */
const useCreateBoardMutation = function (onSuccessCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: (newBoard) => {
      // 'boards' 전체 목록 쿼리를 무효화하여 목록을 다시 가져오도록 유도
      queryClient.invalidateQueries({ queryKey: ["boards"] });

      // 생성된 단일 게시물 쿼리도 무효화 (필요하다면)
      queryClient.invalidateQueries({ queryKey: ["boards", newBoard.id] });

      if (onSuccessCallback) {
        onSuccessCallback(newBoard);
      }
    },
    // onError: (error) => { ... 에러 처리 로직 ... },
  });
};

/**
 * 게시물 수정용 훅
 * @param {function} onSuccessCallback - 성공 시 실행할 추가 콜백
 */
const useUpdateBoardMutation = function (onSuccessCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn은 (id, boardData)를 인수로 받는 함수를 기대하지만,
    // useMutation의 mutate 함수는 단 하나의 인자만 전달받으므로
    // 객체 형태로 {id, boardData}를 전달하고 이를 분해하여 API 함수를 호출합니다.
    mutationFn: ({ id, boardData }) => updateBoard(id, boardData),
    onSuccess: (updatedBoard, variables) => {
      // 'boards' 전체 목록 쿼리를 무효화하여 목록을 다시 가져오도록 유도
      queryClient.invalidateQueries({ queryKey: ["boards"] });

      // 수정된 단일 게시물 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["boards", variables.id] });

      if (onSuccessCallback) {
        onSuccessCallback(updatedBoard);
      }
    },
  });
};

/**
 * 게시물 삭제용 훅
 * @param {function} onSuccessCallback - 성공 시 실행할 추가 콜백
 */
const useDeleteBoardMutation = function (onSuccessCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard, // API 함수 (게시물 ID가 인수로 전달됨)
    onSuccess: (data, id) => {
      // 'boards' 전체 목록 쿼리를 무효화하여 목록을 다시 가져오도록 유도
      queryClient.invalidateQueries({ queryKey: ["boards"] });

      // 삭제된 단일 게시물 쿼리를 제거하여(remove) 캐시에서 완전히 없앱니다.
      queryClient.removeQueries({ queryKey: ["boards", id] });

      if (onSuccessCallback) {
        onSuccessCallback(id);
      }
    },
  });
};

export {
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
};
