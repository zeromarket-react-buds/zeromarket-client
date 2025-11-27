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
