import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductFilter from "./ProductFilter";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { NavLink, useNavigate } from "react-router-dom";

const ProductList = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 검색/sort 관련
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("popularity");

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
      if (sort) params.set("sort", sort);

      console.log("정렬:", sort, "쿼리스트링:", params.toString());

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

      const fetched = data.content;
      const cursor = data.cursor;
      const hasNext = data.hasNext;

      setProducts((prev) => {
        if (!nextCursor) {
          return fetched;
        }

        const existingIds = new Set(prev.map((p) => p.productId));
        const duplicateRemove = fetched.filter(
          (p) => !existingIds.has(p.productId)
        );

        return [...prev, ...duplicateRemove];
      });
      setCursor(cursor);
      setHasNext(hasNext);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setCursor(null);
    fetchHomeProducts(null);
  }, [sort]);

  // sort 관련 함수
  const handleSort = (e) => {
    const sortValue = e.currentTarget.dataset.sort;
    setSort(sortValue);
  };

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
          readOnly
          onClick={() => setIsOpen(true)}
        />
        <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
      </div>

      {/* sort */}
      <div className="flex gap-2 px-2 text-sm -mt-3">
        <NavLink data-sort="popularity" onClick={handleSort}>
          인기순
        </NavLink>{" "}
        |{" "}
        <NavLink data-sort="latest" onClick={handleSort}>
          최신순
        </NavLink>{" "}
        |{" "}
        <NavLink data-sort="priceAsc" onClick={handleSort}>
          낮은가격순
        </NavLink>{" "}
        |{" "}
        <NavLink data-sort="priceDesc" onClick={handleSort}>
          높은가격순
        </NavLink>
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
