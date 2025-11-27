import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, XCircle } from "lucide-react";
import FilterSideBar from "./FilterSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ProductFilter = ({
  isOpen,
  onClose,
  keyword,
  setKeyword,
  sort,
  selectedLevel1Id,
  setSelectedLevel1Id,
  selectedLevel2Id,
  setSelectedLevel2Id,
  selectedLevel3Id,
  setSelectedLevel3Id,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  area,
  setArea,
}) => {
  const [tempKeyword, setTempKeyword] = useState(keyword ?? "");
  const keywordRef = useRef(null);
  const categoryFocusRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTempKeyword(keyword ?? "");
      setTimeout(() => keywordRef.current?.focus(), 0);
    }
  }, [isOpen, keyword]);

  const clearKeywordInput = () => {
    setTempKeyword("");
    setTimeout(() => keywordRef.current?.focus(), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedKeyword = tempKeyword.trim(); // 모달창에서 임시 키워드 input값 넣은 부분
    if (!trimmedKeyword) {
      alert("키워드는 필수입니다");
      return;
    }
    setKeyword(trimmedKeyword); // submit 후 keyword 확정

    const params = new URLSearchParams();
    params.set("keyword", trimmedKeyword);
    if (sort) params.set("sort", sort);

    // 카테고리 1/2/3
    if (selectedLevel1Id != null) params.set("level1Id", selectedLevel1Id);
    if (selectedLevel2Id != null) params.set("level2Id", selectedLevel2Id);
    if (selectedLevel3Id != null) params.set("level3Id", selectedLevel3Id);

    // 가격
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    // 지역
    if (area.trim()) params.set("area", area.trim());

    navigate(`/search?${params.toString()}`);
    onClose();
  };

  return (
    <div>
      {isOpen && (
        /* 모달 배경 */
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* 모달창 */}
          <div
            className="bg-white p-6 rounded-xl z-50 w-[35em] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3 items-center border-b border-brand-mediumgray py-0.5">
              <div className="w-full text-base font-semibold">검색필터</div>
              <Button
                type="button"
                onClick={onClose}
                className="text-base pr-2"
              >
                <XCircle />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative w-full py-2 mb-2">
                <Input
                  placeholder="어떤 상품을 찾으시나요?"
                  className="font-normal"
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  ref={keywordRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      keywordRef.current?.focus();
                      categoryFocusRef.current?.focus();
                    }
                  }}
                />
                {tempKeyword && (
                  <Button
                    type="button"
                    onClick={clearKeywordInput}
                    className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4"
                  >
                    <XCircle />
                  </Button>
                )}
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
              </div>
              <FilterSideBar
                categoryFocusRef={categoryFocusRef}
                selectedLevel1Id={selectedLevel1Id}
                selectedLevel2Id={selectedLevel2Id}
                selectedLevel3Id={selectedLevel3Id}
                setSelectedLevel1Id={setSelectedLevel1Id}
                setSelectedLevel2Id={setSelectedLevel2Id}
                setSelectedLevel3Id={setSelectedLevel3Id}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                area={area}
                setArea={setArea}
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
