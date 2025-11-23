import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductFilter from "@/components/display/ProductFilter";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchHomeProducts = async (nextCursor = null) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
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
      console.log("서버 응답:", data);

      const fetched = data.content || [];
      const next = data.cursor ?? null;
      const nextHas = data.hasNext ?? false;

      setProducts((prev) => (nextCursor ? [...prev, ...fetched] : fetched));
      setCursor(next);
      setHasNext(nextHas);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts(null);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());

    navigate(`/search?${params.toString()}`);
  };
  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div className="relative w-full">
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="어떤 상품을 찾으시나요?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button type="submit">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
          </button>
        </form>
      </div>
      <ProductFilter />
      <ProductCard products={products} />
      <Button className="font-semibold bg-brand-green text-brand-ivory px-4 py-2 rounded-md">
        더 보기
      </Button>
    </div>
  );
};

export default ProductList;
