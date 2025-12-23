import Container from "@/components/Container";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBoardsQuery } from "@/hooks/useBoardsQuery";
import { Link } from "react-router-dom";
import { boardsApi } from "@/common/api/board.api";
import { useEffect, useState } from "react";

const Boards = function () {
  // const { data: boards, isLoading, isError, error } = useBoardsQuery();
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const getBoards = async function () {
      const data = await boardsApi();
      setBoards(data.content);
    };
    getBoards();
  }, []);

  // if (isLoading) return <div>로딩 중...</div>;
  // if (isError || !boards)
  //   return (
  //     <div>
  //       에러 발생: {error.message} | boards: {boards}
  //     </div>
  //   );

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
            {boards &&
              boards.map((b) => (
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
        <Button
          className="bg-lime-700"
          onClick={() => navigate(`/boards/edit`)}
        >
          글 작성
        </Button>
      </div>
    </Container>
  );
};

export default Boards;
