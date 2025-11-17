import Container from "@/components/Container";
import { useBoardByIdQuery } from "@/hooks/useBoardsQuery";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Board() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: board, isLoading, isError, error } = useBoardByIdQuery(id);

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !board)
    return (
      <div>
        에러 발생: {error.message} | boards: {board}
      </div>
    );

  const handleGoBack = () => {
    // 실제 라우팅 환경에 따라 navigate(-1) 또는 특정 목록 경로로 이동
    navigate(-1);
  };

  return (
    <Container>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>{board.title}</CardTitle>
            <CardDescription>{board.createdAt}</CardDescription>
            <CardAction>{board.updatedAt}</CardAction>
          </CardHeader>
          <CardContent>
            <p>{board.content}</p>
          </CardContent>
          <CardFooter className="flex space-x-3">
            <Button variant="outline" onClick={handleGoBack}>
              <ArrowLeftIcon />
              뒤로가기
            </Button>
            <div className="flex-grow"></div>
            <Link to={`/boards/edit/${id}`}>
              <Button className="bg-lime-700">수정</Button>
            </Link>
            <Button className="bg-orange-700">삭제</Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
