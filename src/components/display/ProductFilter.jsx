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
  const keywordRef = useRef(null);
  const categoryFocusRef = useRef(null);
  const navigate = useNavigate();

  // 필터 값들에 대한 임시 상태값
  const [tempKeyword, setTempKeyword] = useState(keyword ?? "");
  const [tempLevel1Id, setTempLevel1Id] = useState(selectedLevel1Id);
  const [tempLevel2Id, setTempLevel2Id] = useState(selectedLevel2Id);
  const [tempLevel3Id, setTempLevel3Id] = useState(selectedLevel3Id);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  const [tempArea, setTempArea] = useState(area);

  //현재 부모 컴포넌트가 들고 있는 필터 상태값을 모달 내부의 임시 값으로 복사해서 초기값으로 세팅
  useEffect(() => {
    if (isOpen) {
      setTempKeyword(keyword ?? "");
      setTempLevel1Id(selectedLevel1Id);
      setTempLevel2Id(selectedLevel2Id);
      setTempLevel3Id(selectedLevel3Id);
      setTempMinPrice(minPrice);
      setTempMaxPrice(maxPrice);
      setTempArea(area);

      setTimeout(() => keywordRef.current?.focus(), 0);
    }
  }, [isOpen]);

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

    // 가격 검증
    const hasMin = tempMinPrice !== null && tempMinPrice !== "";
    const hasMax = tempMaxPrice !== null && tempMaxPrice !== "";

    // 둘 다 값이 있을 때만 검사
    if (hasMin && hasMax && tempMaxPrice <= tempMinPrice) {
      alert("최소 금액은 최대 금액보다 작아야 합니다.");
      return;
    }

    // 지역 문자열 정리
    const trimmedArea = tempArea?.trim() ?? "";

    //쿼리스트링 생성 및 키워드/sort 세팅
    const params = new URLSearchParams();
    params.set("keyword", trimmedKeyword);
    if (sort) params.set("sort", sort);

    // 카테고리
    if (tempLevel3Id != null) {
      params.set("category", tempLevel3Id);
    }

    // 가격
    if (hasMin) params.set("minPrice", tempMinPrice);
    if (hasMax) params.set("maxPrice", tempMaxPrice);

    // 지역
    if (trimmedArea) params.set("area", trimmedArea);

    setKeyword(trimmedKeyword); // 검증된 최종 키워드를 임시 입력값이 아닌 실제 검색 키워드로 확정

    // 임시 값을 부모컴포넌트의 필터값으로 실제 반영
    setSelectedLevel1Id(tempLevel1Id);
    setSelectedLevel2Id(tempLevel2Id);
    setSelectedLevel3Id(tempLevel3Id);
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    setArea(trimmedArea);

    navigate(`/search?${params.toString()}`, {
      state: {
        level1Id: tempLevel1Id,
        level2Id: tempLevel2Id,
        level3Id: tempLevel3Id,
        minPrice: tempMinPrice,
        maxPrice: tempMaxPrice,
        area: trimmedArea,
      },
    });

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
              <div className="relative w-full pt-2 pb-2 my-2">
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
                selectedLevel1Id={tempLevel1Id}
                selectedLevel2Id={tempLevel2Id}
                selectedLevel3Id={tempLevel3Id}
                setSelectedLevel1Id={setTempLevel1Id}
                setSelectedLevel2Id={setTempLevel2Id}
                setSelectedLevel3Id={setTempLevel3Id}
                minPrice={tempMinPrice}
                maxPrice={tempMaxPrice}
                setMinPrice={setTempMinPrice}
                setMaxPrice={setTempMaxPrice}
                area={tempArea}
                setArea={setTempArea}
              />
              {/* 하단 버튼 */}
              <div className="border-t pb-2 pt-4">
                <Button type="submit" variant="green" className="w-full">
                  검색
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
