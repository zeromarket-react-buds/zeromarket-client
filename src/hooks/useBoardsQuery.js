import { useQuery } from "@tanstack/react-query";
import { getBoards, getBoardById } from "@/common/api";

// 전체 게시물 목록 조회용 훅
const useBoardsQuery = function () {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await getBoards();
      // 실제 게시물 배열을 반환하도록 수정
      return response.content;
    },
  });
};

// 특정 게시물 상세 조회용 훅
const useBoardByIdQuery = function (id) {
  return useQuery({
    queryKey: ["boards", id],
    queryFn: async () => {
      const response = await getBoardById(id);
      return response;
    },
    enabled: !!id,
  });
};

export { useBoardsQuery, useBoardByIdQuery };
