import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductFilter from "./ProductFilter";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { NavLink, useNavigate } from "react-router-dom";

const ProductList = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 검색 관련
  const [keyword, setKeyword] = useState("");

  // cursor 관련
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  // 검색 fetch 요청 함수
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

      const fetchedContent = data.content;
      const cursor = data.cursor;
      const hasNext = data.hasNext;

      setProducts((prev) =>
        nextCursor ? [...prev, ...fetchedContent] : fetchedContent
      );
      setCursor(cursor);
      setHasNext(hasNext);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeProducts(null);
  }, []);

  // 글등록 페이지 이동
  const goProductCreatePage = () => {
    navigate(`/products`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-full">
      {/* 상품 검색창 */}
      <div className="relative p-2">
        <Input
          placeholder="어떤 상품을 찾으시나요?"
          onClick={() => setIsOpen(true)}
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
      </div>

      {/* sort */}
      <div className="flex justify-between items-center px-2">
        <Filter className="w-5 h-5" />
        <div className="text-sm">
          <NavLink>인기순</NavLink> | <NavLink>최신순</NavLink> |{" "}
          <NavLink>낮은가격순</NavLink> | <NavLink>높은가격순</NavLink>
        </div>
      </div>

      {/* 필터 */}
      <ProductFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        keyword={keyword}
        setKeyword={setKeyword}
      />
      <ProductCard products={products} onToggleLike={onToggleLike} />

      {/* 더보기 */}
      {hasNext && (
        <Button
          variant="green"
          className="px-4 py-2"
          onClick={() => fetchHomeProducts(cursor)}
          disabled={loading}
        >
          {loading ? "로딩중..." : "더 보기"}
        </Button>
      )}

      {/* 상품등록 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="green"
          className="w-14 h-14 rounded-full flex items-center justify-center"
          onClick={goProductCreatePage}
        >
          등록
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
