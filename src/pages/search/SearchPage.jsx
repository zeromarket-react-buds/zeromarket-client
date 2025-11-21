import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import { Input } from "@/components/ui/input";

const SearchPage = () => {
  return (
    <Container>
      <div className="flex flex-col p-2 gap-4">
        <div>
          <Input placeholder="어떤 상품을 찾으시나요?" />
        </div>
        <ProductFilter />
        <div className="text-2xl">"" 검색 결과</div>
        <div className="grid grid-cols-2 gap-4">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </Container>
  );
};

export default SearchPage;
