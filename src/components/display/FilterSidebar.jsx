import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import CategorySelector from "@/components/product/CategorySelector";

const FilterSideBar = ({
  categoryFocusRef,
  selectedLevel1Id,
  selectedLevel2Id,
  selectedLevel3Id,
  setSelectedLevel1Id,
  setSelectedLevel2Id,
  setSelectedLevel3Id,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  area,
  setArea,
}) => {
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const areaRef = useRef(null);

  const clearCategory = () => {
    setSelectedLevel1Id(null);
    setSelectedLevel2Id(null);
    setSelectedLevel3Id(null);
    setSelectedCategoryName(null);
  };

  const hasArea = !!area;
  const hasPrice = minPrice !== "" || maxPrice !== "";
  const hasCategory =
    selectedLevel1Id != null &&
    selectedLevel2Id != null &&
    selectedLevel3Id != null;

  const isOpen = hasArea || hasPrice || hasCategory;

  const handleMinPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMinPrice(numeric);
  };

  const handleMaxPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMaxPrice(numeric);
  };

  const clearAreaInput = (e) => {
    e.preventDefault(); // submit 방지
    e.stopPropagation(); // 이벤트버블링 방지
    setArea("");
  };

  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedLevel1Id(null);
    setSelectedLevel2Id(null);
    setSelectedLevel3Id(null);
    setMinPrice("");
    setMaxPrice("");
    setArea("");
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 카테고리 */}
      <div className="flex flex-col gap-3">
        <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
          카테고리
        </div>

        <div
          ref={categoryFocusRef}
          tabIndex={0}
          className="flex flex-col gap-3"
        >
          <CategorySelector
            showTitle={false}
            value={{
              depth1: selectedLevel1Id,
              depth2: selectedLevel2Id,
              depth3: selectedLevel3Id,
            }}
            onChange={(d1, d2, d3, labels) => {
              // 선택 해제 시 0 같은 값 들어오면 null로 통일
              setSelectedLevel1Id(d1 || null);
              setSelectedLevel2Id(d2 || null);
              setSelectedLevel3Id(d3 || null);

              // UI용 이름
              const name = labels?.level3Name;
              null;

              setSelectedCategoryName(name);
            }}
          />
        </div>
      </div>

      {/* 가격 */}
      <div className="flex flex-col gap-3 my-0.5">
        <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
          가격
        </div>
        <div className="flex w-full items-center gap-2">
          <Input
            onChange={handleMinPrice}
            inputMode="numeric"
            value={minPrice}
            className="font-normal"
            placeholder="최소 가격"
            ref={minPriceRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                maxPriceRef.current?.focus();
              }
            }}
          />
          <span>-</span>
          <Input
            onChange={handleMaxPrice}
            inputMode="numeric"
            value={maxPrice}
            className="font-normal"
            placeholder="최대 가격"
            ref={maxPriceRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                areaRef.current?.focus();
              }
            }}
          />
        </div>
      </div>

      {/* 지역 */}
      <div className="flex flex-col text-base font-semibold gap-3 my-0.5">
        <div className="border-b border-brand-mediumgray py-2">지역</div>
        <div className="relative w-full">
          <Input
            value={area}
            ref={areaRef}
            className="font-normal"
            onChange={(e) => setArea(e.target.value)}
            placeholder="지역을 입력해주세요"
          />
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          >
            <Search />
          </Button>
          {area && (
            <Button
              type="button"
              onClick={clearAreaInput}
              className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4"
            >
              <XCircle />
            </Button>
          )}
        </div>
        <Button variant="ivory">현재 내 위치 사용하기</Button>
      </div>

      {/* 선택한 필터 */}
      {isOpen && (
        <div className="my-0.5 flex flex-col">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
            선택한 필터
          </div>
          <div className="flex py-3 gap-2">
            {hasCategory && (
              <Button
                variant="line"
                type="button"
                className="items-center"
                onClick={clearCategory}
              >
                <span className="font-normal">{selectedCategoryName}</span>
                <span className="text-brand-mediumgray">
                  <XCircle />
                </span>
              </Button>
            )}

            {hasPrice && (
              <Button
                variant="line"
                type="button"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                }}
                className="items-center"
              >
                <span className="font-normal">
                  {minPrice || "0"} - {maxPrice || "상한 없음"}
                </span>
                <span className="text-brand-mediumgray">
                  <XCircle />
                </span>
              </Button>
            )}

            {hasArea && (
              <Button
                variant="line"
                type="button"
                onClick={() => {
                  setArea("");
                }}
                className="items-center"
              >
                <span className="font-normal">{area}</span>
                <span className="text-brand-mediumgray">
                  <XCircle />
                </span>
              </Button>
            )}
          </div>
          {(hasCategory || hasPrice || hasArea) && (
            <span
              onClick={handleClearAll}
              className="text-sm text-brand-darkgray underline justify-start cursor-pointer"
            >
              초기화
            </span>
          )}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="border-t py-2">
        <Button type="submit" variant="green" className="w-full">
          검색
        </Button>
      </div>
    </div>
  );
};

export default FilterSideBar;
