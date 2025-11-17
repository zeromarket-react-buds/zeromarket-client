import Container from "@/components/Container";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useBoardByIdQuery } from "@/hooks/useBoardsQuery";
import { useNavigate } from "react-router-dom";
import {
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} from "@/hooks/useBoardMutation";
import { useParams } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { ArrowLeftIcon, SaveIcon, Trash2Icon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BoardEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // id가 있으면 수정 모드, 없으면 작성 모드
  const boardId = id ? Number(id) : null;

  const isEditMode = useMemo(() => !!boardId, [boardId]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 수정 모드일 때 기존 데이터 로드
  const { data: boardData, isLoading, isError } = useBoardByIdQuery(boardId);

  const createMutation = useCreateBoardMutation((newId) => {
    // 성공 시, 상세 페이지나 목록으로 이동 (예: 수정된 페이지로 이동)
    navigate(`/boards/${newId}`);
  });

  const updateMutation = useUpdateBoardMutation((updatedId) => {
    // 성공 시, 상세 페이지로 이동
    navigate(`/boards/${updatedId}`);
  });

  const deleteMutation = useDeleteBoardMutation(() => {
    // 성공 시, 목록 페이지로 이동
    navigate("/boards");
  });

  // 4. 데이터 로딩 완료 시 폼 채우기
  useEffect(() => {
    if (isEditMode && boardData) {
      setTitle(boardData.title);
      setContent(boardData.content);
    } else if (!isEditMode) {
      // 작성 모드일 때 상태 초기화
      setTitle("");
      setContent("");
    }
  }, [isEditMode, boardData]);

  // 5. 등록/수정 처리 함수
  const handleSave = useCallback(() => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요."); // Custom modal required in production
      return;
    }
    // todo: writerId 임시
    const boardPayload = { writerId: 100, title, content, status: "FREE" };

    if (isEditMode) {
      updateMutation.mutate({ id: boardId, boardData: boardPayload });
    } else {
      createMutation.mutate(boardPayload);
    }
  }, [title, content, isEditMode, boardId, createMutation, updateMutation]);

  // 6. 삭제 처리 함수
  const handleDelete = useCallback(() => {
    // Custom confirmation modal should replace window.confirm
    if (isEditMode && window.confirm("게시물을 삭제하시겠습니까?")) {
      deleteMutation.mutate(boardId);
    }
  }, [isEditMode, boardId, deleteMutation]);

  const handleGoBack = () => {
    // 실제 라우팅 환경에 따라 navigate(-1) 또는 특정 목록 경로로 이동
    navigate(-1);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  // 로딩 및 에러 처리
  if (isEditMode && isLoading) {
    return (
      <Container>
        <div className="text-center p-12 text-gray-500 flex items-center justify-center space-x-2">
          <Loader2 className="animate-spin w-5 h-5" />
          <span>게시물 불러오는 중...</span>
        </div>
      </Container>
    );
  }

  if (isEditMode && isError) {
    return (
      <Container>
        <div className="text-center p-12 text-red-500">
          게시물을 불러오지 못했습니다. (ID: {boardId})
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-700">
          {isEditMode ? "게시물 수정" : "새 게시물 작성"}
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>
              <Input
                placeholder="글 제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={15}
              className="!min-h-[300px]"
              placeholder="글 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isSaving}
            ></Textarea>
          </CardContent>
          <CardFooter className="flex space-x-3">
            {/* 뒤로가기 버튼 */}
            <Button
              variant="outline"
              onClick={handleGoBack}
              disabled={isSaving}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              뒤로가기
            </Button>

            {/* 삭제 버튼 (수정 모드일 때만 표시) */}
            {isEditMode && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="bg-red-500 hover:bg-red-600"
                icon={isDeleting ? Loader2 : Trash2Icon}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
            )}

            <div className="flex-grow"></div>

            {/* 등록/수정 버튼 */}
            <Button
              className="bg-lime-600 hover:bg-lime-700"
              onClick={handleSave}
              disabled={isSaving}
              icon={isSaving ? Loader2 : SaveIcon}
            >
              {isSaving ? "저장 중..." : isEditMode ? "수정 완료" : "등록"}
            </Button>
          </CardFooter>
        </Card>

        {/* Mutation 결과 메시지 */}
        {(createMutation.isError ||
          updateMutation.isError ||
          deleteMutation.isError) && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
            <p className="font-semibold">작업 실패:</p>
            <p>
              {createMutation.error?.message ||
                updateMutation.error?.message ||
                deleteMutation.error?.message}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
