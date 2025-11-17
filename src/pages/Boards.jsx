import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useBoardsQuery } from "@/hooks/useBoardsQuery";
import { Link } from "react-router-dom";

export default function Boards() {
  const { data: boards, isLoading, isError, error } = useBoardsQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !boards)
    return (
      <div>
        에러 발생: {error.message} | boards: {boards}
      </div>
    );

  return (
    <Container>
      <h1 className="text-2xl font-bold">게시판 목록</h1>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>글제목</TableHead>
              <TableHead>생성일자</TableHead>
              <TableHead>수정일자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boards.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.id}</TableCell>
                <TableCell className="font-bold">
                  <Link to={`/boards/${b.id}`}>{b.title}</Link>
                </TableCell>
                <TableCell>{b.createdAt}</TableCell>
                <TableCell>{b.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
