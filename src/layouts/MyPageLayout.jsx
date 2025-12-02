//공통 padding, width 등을 맞춰주는 Layout
//마이페이지 하위의 모든 내용물을 감싸는 Container만 적용
import Container from "@/components/Container";
import { Outlet } from "react-router-dom";
const MyPageLayout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default MyPageLayout;
