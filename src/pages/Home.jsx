import Container from "@/components/Container";

import ProductList from "@/components/ProductList";
const Home = function () {
  return (
    <Container>
      <div>
        <h1>홈입니다!!</h1>
        <ProductList />
      </div>
    </Container>
  );
};
export default Home;
