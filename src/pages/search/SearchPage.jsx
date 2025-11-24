import Container from "@/components/Container";
import ProductCard from "@/components/display/ProductCard";
import ProductFilter from "@/components/display/ProductFilter";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";

  const [keyword, setKeyword] = useState(keywordFromUrl);

  const fetchProducts = async (nextCursor = null) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (keywordFromUrl) params.set("keyword", keywordFromUrl);
      if (nextCursor !== null) params.set("cursor", nextCursor);

      const res = await fetch(
        `http://localhost:8080/api/products?${params.toString()}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("비정상 응답:", text);
        return;
      }

      const data = await res.json();
      const fetched = data.content || [];
      const next = data.cursor ?? null;
      const nextHas = data.hasNext ?? false;

      setProducts((prev) => (nextCursor ? [...prev, ...fetched] : fetched));
      setCursor(next);
      setHasNext(nextHas);
    } catch (e) {
      console.error("상품 목록 불러오기 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setCursor(null);
    setHasNext(true);
    setKeyword(keywordFromUrl);
    fetchProducts(null);
  }, [keywordFromUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());

    navigate(`/search?${params.toString()}`);
  };

  return (
    <Container>
      <div className="flex flex-col p-2 gap-4">
        <form onSubmit={handleSubmit} className="relative w-full">
          <Input
            placeholder="어떤 상품을 찾으시나요?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4">
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <ProductFilter />
        <div className="text-2xl font-semibold">"{keyword}" 검색 결과</div>
        <ProductCard products={products} />
      </div>
    </Container>
  );
};

export default SearchPage;
