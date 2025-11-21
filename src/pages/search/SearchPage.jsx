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
        <div className="text-2xl font-semibold">"" 검색 결과</div>
        <ProductCard />
      </div>
    </Container>
  );
};

export default SearchPage;
