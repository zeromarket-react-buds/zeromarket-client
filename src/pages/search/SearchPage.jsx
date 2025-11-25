import Container from "@/components/Container";
import ProductCard from "@/components/display/ProductCard";
import ProductFilter from "@/components/display/ProductFilter";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { Filter, Search } from "lucide-react";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 검색 관련
  const [searchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get("keyword") || "";
  const [keyword, setKeyword] = useState(keywordFromUrl);

  // cursor 관련
  const [cursor, setCursor] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  // 스크롤 하단 감지용 ref
  const loaderRef = useRef(null);

  // 검색 fetch 요청 함수
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
      const fetched = data.content;
      const next = data.cursor;
      const nextHas = data.hasNext;

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

  // cursor 관련 무한스크롤
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting) {
        fetchProducts(cursor);
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [cursor]);

  // 글등록 페이지 이동
  const goProductCreatePage = () => {
    navigate(`/products`);
  };

  return (
    <Container>
      <div className="flex flex-col gap-4 max-w-full">
        {/* 상품 검색창 */}
        <div className="relative p-2">
          <Input
            placeholder="어떤 상품을 찾으시나요?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
        <div className="text-2xl font-semibold">"{keyword}" 검색 결과</div>
        <ProductCard products={products} onToggleLike={onToggleLike} />
      </div>

      {/* 무한 스크롤 */}
      {hasNext && <div ref={loaderRef} className="h-10" />}

      {loading && <div className="py-4 text-center">로딩중...</div>}

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
    </Container>
  );
};

export default SearchPage;
