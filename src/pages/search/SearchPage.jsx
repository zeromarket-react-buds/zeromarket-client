import Container from "@/components/Container";
import ProductCard from "@/components/display/ProductCard";
import ProductFilter from "@/components/display/ProductFilter";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 검색/sort 관련 받아오는 쪽
  const searchParams = new URLSearchParams(location.search);
  const keywordFromUrl = searchParams.get("keyword") || "";
  const sortFromUrl = searchParams.get("sort") ?? "popularity";

  // 실제 서버 요청에 쓰이는 확정된 상태
  const [keyword, setKeyword] = useState(keywordFromUrl);
  const [sort, setSort] = useState(sortFromUrl);

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

  // 스크롤 하단 감지용 ref
  const loaderRef = useRef(null);

  // 검색 fetch 요청 함수
  const fetchProducts = async (nextOffset = null) => {
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
      const fetched = data.content;
      const offset = data.offset;
      const nextHas = data.hasNext;

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
      setHasNext(nextHas);
    } catch (e) {
      console.error("상품 목록 불러오기 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  // 다시 그려지는 기준
  useEffect(() => {
    setProducts([]);
    setOffset(null);
    setHasNext(true);
    fetchProducts(null);
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
  const handleSort = (e) => {
    const value = e.currentTarget.dataset.sort;
    if (!value || value === sort) return;

    // 상태 변경
    setSort(value);

    // 현재 URL 기준으로 sort만 교체, offset 제거
    const params = new URLSearchParams(location.search);
    params.set("sort", value);
    params.delete("offset"); // 페이지를 처음부터 다시 보기 위해

    navigate({
      pathname: "/search",
      search: params.toString(),
    });
  };

  // offset 관련 무한스크롤
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (entry.isIntersecting && hasNext && !loading) {
        fetchProducts(offset);
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [offset, sort, hasNext, loading]);

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
            readOnly
            onClick={() => setIsOpen(true)}
          />
          <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
        </div>

        {/* sort */}
        <div className="flex gap-2 px-2 text-sm -mt-3">
          <span
            data-sort="popularity"
            onClick={handleSort}
            className={
              sort === "popularity"
                ? "cursor-pointer font-semibold"
                : "cursor-pointer text-brand-mediumgray"
            }
          >
            인기순
          </span>{" "}
          |{" "}
          <span
            data-sort="latest"
            onClick={handleSort}
            className={
              sort === "latest"
                ? "cursor-pointer font-semibold"
                : "cursor-pointer text-brand-mediumgray"
            }
          >
            최신순
          </span>{" "}
          |{" "}
          <span
            data-sort="priceAsc"
            onClick={handleSort}
            className={
              sort === "priceAsc"
                ? "cursor-pointer font-semibold"
                : "cursor-pointer text-brand-mediumgray"
            }
          >
            낮은가격순
          </span>{" "}
          |{" "}
          <span
            data-sort="priceDesc"
            onClick={handleSort}
            className={
              sort === "priceDesc"
                ? "cursor-pointer font-semibold"
                : "cursor-pointer text-brand-mediumgray"
            }
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
