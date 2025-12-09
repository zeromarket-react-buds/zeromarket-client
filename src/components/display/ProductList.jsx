import ProductCard from "@/components/display/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { getProductListApi } from "@/common/api/product.api";
import ProductFilterModal from "@/components/display/ProductFilterModal";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/AuthContext";

const ProductList = () => {
  const { products, setProducts, onToggleLike } = useLikeToggle([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // ⭐ 로그인 사용자 정보
  const { user, isAuthenticated } = useAuth();
  // 로그인 안된 상태에서도 테스트용 memberId=1 사용
  const memberId = isAuthenticated ? user.memberId : 1;

  //찜하트 유지 안돼서 콘솔확인
  useEffect(() => {
    console.log("📌 [ProductList] 현재 로그인한 memberId =", memberId);
  }, [memberId]);

  // 검색/sort 관련
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("popularity"); //popularity인기순/ latest인기순 정렬을 사용자 명시 선택시에만

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

  // ⭐ 찜 토글 후 UI 즉시 반영 함수
  const handleToggleWish = async (productId) => {
    console.log("❤️ handleToggleWish 호출됨", productId);

    // 백엔드 토글 API 수행 (true/false 반환)
    const newState = await onToggleLike(productId);

    // UI 즉시 업데이트 — 여기가 핵심!
    setProducts((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, isWished: newState } : item
      )
    );

    return newState;
  };

  // 검색 fetch 요청 함수
  //상품 목록 API 요청
  const fetchHomeProducts = async (nextOffset = null) => {
    if (loading) return;
    setLoading(true);

    try {
      //찜유지위해 memberId추가 콘솔확인
      console.log("📌 [fetchHomeProducts] memberId 보내는 값 =", memberId);

      const query = {
        offset: nextOffset,
        sort,
        keyword,
        categoryId: selectedLevel3Id,
        minPrice,
        maxPrice,
        area,
      };
      // 찜색유지 안돼는 문제콘솔 호출 직전 URL 모양 확인
      console.log("📌 [fetchHomeProducts] query =", query);

      //찜색유지 안돼는 문제콘솔. memberId전달
      const data = await getProductListApi(query, memberId);
      console.log("📌 [fetchHomeProducts] API 응답 =", data);

      const fetched = data.content;
      const offset = data.offset;
      const hasNext = data.hasNext;

      setProducts((prev) => {
        // 화면 처음 그려질 때(nextOffset 없을 경우)는 그냥 fetch 요청한거 그대로
        if (nextOffset === null) {
          // 첫 로딩 → 그대로 적용
          return fetched;
        }

        // 불려와진 후
        //추가 로딩 시 중복 제거
        const existingIds = new Set(prev.map((p) => p.productId));
        const newItems = fetched.filter((p) => !existingIds.has(p.productId));

        return [...prev, ...newItems];
      });

      setOffset(offset);
      setHasNext(hasNext);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };
  // sort/filter 변경 시 목록 재호출
  useEffect(() => {
    //찜 유지 안돼는 문제를 위한콘솔
    console.log(
      "⭐ memberId 변경 감지 → 상품 목록을 다시 불러옵니다:",
      memberId
    );
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

  // ⭐ 로그인 복구(memberId 변화) 시 → 강제 재조회
  useEffect(() => {
    console.log("🔄 memberId 변경 감지 → 전체 리스트 다시 조회:", memberId);
    setProducts([]);
    setOffset(null);
    fetchHomeProducts(null);
  }, [memberId]); // 🔥 이게 핵심!

  // sort 관련 함수
  const handleSort = (value) => {
    if (!value || value === sort) return;
    setSort(value);
  };

  // 모달에서 검색 버튼 눌렀을 때 검색 페이지로 이동
  const handleFilterApply = (payload) => {
    const params = new URLSearchParams();
    params.set("keyword", payload.keyword);
    if (payload.sort) params.set("sort", payload.sort);
    if (payload.level3Id != null) params.set("categoryId", payload.level3Id);
    if (payload.minPrice !== "" && payload.minPrice != null) {
      params.set("minPrice", payload.minPrice);
    }
    if (payload.maxPrice !== "" && payload.maxPrice != null) {
      params.set("maxPrice", payload.maxPrice);
    }
    if (payload.area) {
      params.set("area", payload.area);
    }

    navigate(`/search?${params.toString()}`, {
      state: {
        level1Id: payload.level1Id,
        level2Id: payload.level2Id,
        level3Id: payload.level3Id,
        minPrice: payload.minPrice,
        maxPrice: payload.maxPrice,
        area: payload.area,
      },
    });
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

      {/*  필터 모달 */}
      <ProductFilterModal
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
        onApply={handleFilterApply}
      />

      {/* 상품 카드 목록 */}
      {/* 서버로 찜 토글 + UI 즉시반영 */}
      {/*onToggleLike는 UI 내부 상태만 바꾸던 오래된 함수라 서버값 반영이 안 됨*/}
      <ProductCard products={products} onToggleLike={handleToggleWish} />

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
