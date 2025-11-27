import Container from "@/components/Container";
import { useParams } from "react-router-dom";

const ProductEditPage = () => {
  const { id } = useParams();
  return (
    <Container>
      <div>상품수정페이지 / 현재 수정중 상품 ID : {id}</div>
    </Container>
  );
};
export default ProductEditPage;
