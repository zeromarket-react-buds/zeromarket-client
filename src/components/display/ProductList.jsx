import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import ProductFilter from "./ProductFilter";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // 검색/sort 관련
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("popularity");

  // 필터 관련
  const [selectedLevel1Id, setSelectedLevel1Id] = useState(null);
  const [selectedLevel2Id, setSelectedLevel2Id] = useState(null);
  const [selectedLevel3Id, setSelectedLevel3Id] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [area, setArea] = useState("");

  // offset 관련
  const [offset, setOffset] = useState(null);
  const [hasNext, setHasNext] = useState(true);

  // 검색 fetch 요청 함수
  const fetchHomeProducts = async (nextOffset = null) => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (nextOffset !== null) params.set("offset", nextOffset);
      if (sort) params.set("sort", sort);
      if (keyword.trim()) params.set("keyword", keyword.trim());

      // 카테고리
      if (selectedLevel3Id != null) params.set("category", selectedLevel3Id);

      // 가격
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);

      // 지역
      if (area.trim()) params.set("area", area.trim());

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
      const offset = data.offset;
      const hasNext = data.hasNext;

      setProducts((prev) => {
        // 화면 처음 그려질 때(nextOffset 없을 경우)는 그냥 fetch 요청한거 그대로
        if (nextOffset === null) {
          return fetched;
        }

        // 불려와진 후
        const existingIds = new Set(prev.map((p) => p.productId));
        const duplicateRemove = fetched.filter(
          (p) => !existingIds.has(p.productId)
        );

        return [...prev, ...duplicateRemove];
      });
      setOffset(offset);
      setHasNext(hasNext);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setOffset(null);
    fetchHomeProducts(null);
  }, [
    sort,
    keyword,
    selectedLevel1Id,
    selectedLevel2Id,
    selectedLevel3Id,
    minPrice,
    maxPrice,
    area,
  ]);

  // sort 관련 함수
  const handleSort = (value) => {
    if (!value || value === sort) return;
    setSort(value);
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
        <span
          onClick={() => handleSort("popularity")}
          className={`cursor-pointer ${
            sort === "popularity" ? "font-semibold" : "text-brand-mediumgray"
          }`}
        >
          인기순
        </span>{" "}
        |{" "}
        <span
          onClick={() => handleSort("latest")}
          className={`cursor-pointer ${
            sort === "latest" ? "font-semibold" : "text-brand-mediumgray"
          }`}
        >
          최신순
        </span>{" "}
        |{" "}
        <span
          onClick={() => handleSort("priceAsc")}
          className={`cursor-pointer ${
            sort === "priceAsc" ? "font-semibold" : "text-brand-mediumgray"
          }`}
        >
          낮은가격순
        </span>{" "}
        |{" "}
        <span
          onClick={() => handleSort("priceDesc")}
          className={`cursor-pointer ${
            sort === "priceDesc" ? "font-semibold" : "text-brand-mediumgray"
          }`}
        >
          높은가격순
        </span>
      </div>

      {/* 필터 */}
      <ProductFilter
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        keyword={keyword}
        setKeyword={setKeyword}
        sort={sort}
        selectedLevel1Id={selectedLevel1Id}
        setSelectedLevel1Id={setSelectedLevel1Id}
        selectedLevel2Id={selectedLevel2Id}
        setSelectedLevel2Id={setSelectedLevel2Id}
        selectedLevel3Id={selectedLevel3Id}
        setSelectedLevel3Id={setSelectedLevel3Id}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        area={area}
        setArea={setArea}
      />
      <ProductCard products={products} onToggleLike={onToggleLike} />

      {/* 더보기 */}
      {hasNext && (
        <Button
          variant="green"
          className="px-4 py-2"
          onClick={() => fetchHomeProducts(offset)}
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
