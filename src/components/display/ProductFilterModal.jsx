import { Button } from "@/components/ui/button";
import { Filter, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import KeywordFilterSection from "@/components/display/KeywordFilterSection";
import CategoryFilterSection from "@/components/display/CategoryFilterSection";
import PriceFilterSection from "@/components/display/PriceFilterSection";
import AreaFilterSection from "@/components/display/AreaFilterSection";
import SelectedFiltersSection from "@/components/display/SelectedFiltersSection";
import { useModal } from "@/hooks/useModal";
import TradeFilterSection from "@/components/display/TradeFilterSection";

const ProductFilterModal = ({
  isOpen,
  onClose,
  defaultFilterOpen = false,
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
  trade,
  setTrade,
  onApply,
}) => {
  const keywordRef = useRef(null);
  const categoryFocusRef = useRef(null);
  const areaRef = useRef(null);
  const buttonRef = useRef(null);

  const { alert } = useModal();

  const [filterOpen, setFilterOpen] = useState(false);

  // 필터 값들에 대한 임시 상태값
  const [tempKeyword, setTempKeyword] = useState(keyword ?? "");
  const [tempLevel1Id, setTempLevel1Id] = useState(selectedLevel1Id);
  const [tempLevel2Id, setTempLevel2Id] = useState(selectedLevel2Id);
  const [tempLevel3Id, setTempLevel3Id] = useState(selectedLevel3Id);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  const [tempArea, setTempArea] = useState(area);
  const [tempCategoryName, setTempCategoryName] = useState(null); // 카테고리 이름 임시 상태
  const [tempTrade, setTempTrade] = useState(trade);

  // 모달이 열릴 때마다 부모 상태를 임시 상태로 복사
  useEffect(() => {
    if (isOpen) {
      setFilterOpen(defaultFilterOpen);

      setTempKeyword(keyword ?? "");
      setTempLevel1Id(selectedLevel1Id);
      setTempLevel2Id(selectedLevel2Id);
      setTempLevel3Id(selectedLevel3Id);
      setTempMinPrice(minPrice);
      setTempMaxPrice(maxPrice);
      setTempArea(area);
      setTempTrade(trade);

      setTimeout(() => keywordRef.current?.focus(), 0);
    }
  }, [isOpen]);

  const clearKeyword = () => {
    setTempKeyword("");
    setTimeout(() => keywordRef.current?.focus(), 0);
  };

  const clearCategory = () => {
    setTempLevel1Id(null);
    setTempLevel2Id(null);
    setTempLevel3Id(null);
    setTempCategoryName(null);
  };

  const clearPrice = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
  };

  const clearArea = () => {
    setTempArea("");
  };

  const clearTrade = () => {
    setTempTrade({
      delivery: false,
      direct: false,
    });
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    clearCategory();
    clearPrice();
    clearArea();
    clearTrade();
  };

  const handleClose = () => {
    setFilterOpen(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedKeyword = tempKeyword.trim();
    // 키워드 필수 조건 삭제
    // if (!trimmedKeyword) {
    //   await alert({ description: "키워드는 필수입니다" });
    //   return;
    // }

    // 가격 검증
    const hasMin = tempMinPrice !== null && tempMinPrice !== "";
    const hasMax = tempMaxPrice !== null && tempMaxPrice !== "";

    if (hasMin && hasMax && tempMaxPrice <= tempMinPrice) {
      await alert({ description: "최소 금액은 최대 금액보다 작아야 합니다." });
      return;
    }

    const trimmedArea = tempArea ? tempArea.trim() : "";

    // 부모에게 넘겨줄 최종 필터 값
    const payload = {
      keyword: trimmedKeyword,
      sort,
      level1Id: tempLevel1Id,
      level2Id: tempLevel2Id,
      level3Id: tempLevel3Id,
      minPrice: hasMin ? tempMinPrice : "",
      maxPrice: hasMax ? tempMaxPrice : "",
      area: trimmedArea,
      trade: tempTrade,
    };

    // 부모 상태 업데이트
    setKeyword(trimmedKeyword); // 검증된 최종 키워드를 임시 입력값이 아닌 실제 검색 키워드로 확정
    setSelectedLevel1Id(tempLevel1Id);
    setSelectedLevel2Id(tempLevel2Id);
    setSelectedLevel3Id(tempLevel3Id);
    setMinPrice(payload.minPrice);
    setMaxPrice(payload.maxPrice);
    setArea(trimmedArea);
    setTrade(tempTrade);

    // 실제 "검색 실행"은 부모 onApply에 위임
    if (onApply) {
      onApply(payload);
    }

    // 모달 닫기
    handleClose();
  };

  return (
    <div>
      {isOpen && (
        /* 모달 배경 */
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          {/* 모달창 */}
          <div
            className="bg-white p-6 rounded-xl z-50 w-[35em] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-mediumgray py-0.5">
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold">검색필터</span>

                <Button
                  type="button"
                  onClick={() => setFilterOpen((prev) => !prev)}
                  className={`mt-1 h-4.5 px-2 py-1 hover:bg-transparent cursor-pointer ${
                    filterOpen ? "!bg-brand-green" : "!bg-brand-mediumgray"
                  }`}
                >
                  <span className="flex items-center gap-1 text-white">
                    <Filter className="size-3.5" />
                    {filterOpen ? "ON" : "OFF"}
                  </span>
                </Button>
              </div>

              <Button type="button" onClick={handleClose}>
                <XCircle />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 키워드 */}
              <KeywordFilterSection
                filterOpen={filterOpen}
                tempKeyword={tempKeyword}
                setTempKeyword={setTempKeyword}
                keywordRef={keywordRef}
                clearKeyword={clearKeyword}
                categoryFocusRef={categoryFocusRef}
                buttonRef={buttonRef}
              />

              {filterOpen && (
                <>
                  {/* 카테고리 */}
                  <CategoryFilterSection
                    categoryFocusRef={categoryFocusRef}
                    selectedLevel1Id={tempLevel1Id}
                    selectedLevel2Id={tempLevel2Id}
                    selectedLevel3Id={tempLevel3Id}
                    setSelectedLevel1Id={setTempLevel1Id}
                    setSelectedLevel2Id={setTempLevel2Id}
                    setSelectedLevel3Id={setTempLevel3Id}
                    setTempCategoryName={setTempCategoryName}
                  />

                  {/* 가격 */}
                  <PriceFilterSection
                    minPrice={tempMinPrice}
                    maxPrice={tempMaxPrice}
                    setMinPrice={setTempMinPrice}
                    setMaxPrice={setTempMaxPrice}
                    onEnterToArea={() => {
                      areaRef.current?.focus();
                    }}
                  />

                  {/* 지역 */}
                  <AreaFilterSection
                    area={tempArea}
                    setArea={setTempArea}
                    areaRef={areaRef}
                    onEnterToButton={() => {
                      buttonRef.current?.focus();
                    }}
                  />

                  {/* 거래방법 */}
                  <TradeFilterSection
                    trade={tempTrade}
                    setTrade={setTempTrade}
                  />

                  {/* 선택한 필터 */}
                  <SelectedFiltersSection
                    categoryName={tempCategoryName}
                    minPrice={tempMinPrice}
                    maxPrice={tempMaxPrice}
                    area={tempArea}
                    trade={tempTrade}
                    clearCategory={clearCategory}
                    clearPrice={clearPrice}
                    clearArea={clearArea}
                    handleClearAll={handleClearAll}
                  />
                </>
              )}

              {/* 검색 버튼 */}
              <Button
                type="submit"
                ref={buttonRef}
                variant="green"
                className="w-full"
              >
                검색
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilterModal;
