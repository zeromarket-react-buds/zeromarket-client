import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const categoryTree = [
  {
    level1Id: 1,
    level1Name: "수입명품",
    children: [
      {
        level2Id: 11,
        level2Name: "여성신발",
        children: [
          {
            level3Id: 111,
            parentId: 11,
            level3Name: "운동화/스니커즈",
          },
          {
            level3Id: 112,
            parentId: 11,
            level3Name: "샌들/슬리퍼",
          },
          {
            level3Id: 113,
            parentId: 11,
            level3Name: "구두/로퍼",
          },
        ],
      },
    ],
  },
  {
    level1Id: 2,
    level1Name: "남성신발",
    children: [
      {
        level2Id: 21,
        level2Name: "캐주얼화",
        children: [
          {
            level3Id: 211,
            parentId: 21,
            level3Name: "운동화/스니커즈",
          },
          {
            level3Id: 212,
            parentId: 21,
            level3Name: "샌들/슬리퍼",
          },
        ],
      },
      {
        level2Id: 22,
        level2Name: "정장구두",
        children: [
          {
            level3Id: 221,
            parentId: 22,
            level3Name: "국내구두",
          },
          {
            level3Id: 222,
            parentId: 22,
            level3Name: "해외구두",
          },
        ],
      },
    ],
  },
];

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
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);
  const areaRef = useRef(null);

  // 펼쳐진 1,2차 카테고리
  const [openLevel1Id, setOpenLevel1Id] = useState(null);
  const [openLevel2Id, setOpenLevel2Id] = useState(null);

  // 1차 카테고리 클릭 열기/접기
  const toggleLevel1 = (level1Id) => {
    setOpenLevel1Id((prev) => (prev === level1Id ? null : level1Id));
  };

  // 2차 선택, 카테고리 클릭 열기/접기
  const handleSelectLevel2 = (level1Id, level2Id) => {
    setOpenLevel2Id((prev) => (prev === level2Id ? null : level2Id));
    setSelectedLevel1Id(level1Id);
    setSelectedLevel2Id(level2Id);
  };

  // 3차 선택
  const handleSelectLevel3 = (level1Id, level2Id, level3Id) => {
    setSelectedLevel1Id(level1Id);
    setSelectedLevel2Id(level2Id);
    setSelectedLevel3Id(level3Id);
  };

  const getSelectedCategoryPath = () => {
    if (
      selectedLevel1Id == null ||
      selectedLevel2Id == null ||
      selectedLevel3Id == null
    ) {
      return null;
    }

    const level1 = categoryTree.find((c) => c.level1Id === selectedLevel1Id);
    if (!level1) return null;

    const level2 = level1.children?.find(
      (c) => c.level2Id === selectedLevel2Id
    );
    if (!level2) return null;

    const level3 = level2.children?.find(
      (c) => c.level3Id === selectedLevel3Id
    );
    if (!level3) return null;

    return {
      level1Name: level1.level1Name,
      level2Name: level2.level2Name,
      level3Name: level3.level3Name,
    };
  };

  const selectedCategory = getSelectedCategoryPath();

  const clearCategory = () => {
    setSelectedLevel1Id(null);
    setSelectedLevel2Id(null);
    setSelectedLevel3Id(null);
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

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 카테고리 */}
      <div className="flex flex-col gap-3">
        <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
          카테고리
        </div>

        {/* 바깥 카테고리 박스 */}
        <div
          className="bg-brand-lightgray border -mt-3"
          ref={categoryFocusRef}
          tabIndex={0}
        >
          {categoryTree.map((level1) => {
            const isOpenCategory2 = openLevel1Id === level1.level1Id;
            return (
              <div key={level1.level1Id} className="border last:border-b-0">
                {/* 1차 카테고리 */}
                <button
                  type="button"
                  onClick={() => toggleLevel1(level1.level1Id)}
                  className="flex border-brand-darkgray w-full items-center justify-between px-6 py-2 text-left "
                >
                  <span className="text-brand-darkgray text-sm">
                    {level1.level1Name}
                  </span>
                  {isOpenCategory2 ? (
                    <ChevronUp className="w-4 h-4 text-brand-darkgray" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-brand-darkgray" />
                  )}
                </button>

                {/* 2차/3차 영역 */}
                {isOpenCategory2 && (
                  <div className="bg-brand-lightgray px-3 pb-2">
                    {level1.children.map((level2) => {
                      const isOpenCategory3 = openLevel2Id === level2.level2Id;

                      return (
                        <div key={level2.level2Id} className="pl-6">
                          {/* 2차 */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectLevel2(
                                level1.level1Id,
                                level2.level2Id
                              )
                            }
                            className="flex w-full items-center justify-between py-2 text-left text-sm pr-3"
                          >
                            <span className="text-brand-darkgray text-sm">
                              {level2.level2Name}
                            </span>
                            {isOpenCategory3 ? (
                              <ChevronUp className="w-4 h-4 text-brand-darkgray" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-brand-darkgray" />
                            )}
                          </button>

                          {/* 3차 */}
                          {isOpenCategory3 && (
                            <div className="pl-5">
                              {level2.children.map((level3) => {
                                const isSelectedLevel3 =
                                  selectedLevel3Id === level3.level3Id;

                                return (
                                  <button
                                    key={level3.level3Id}
                                    type="button"
                                    onClick={() =>
                                      handleSelectLevel3(
                                        level1.level1Id,
                                        level2.level2Id,
                                        level3.level3Id
                                      )
                                    }
                                    className={[
                                      "block w-full text-left py-1.5 text-brand-darkgray text-sm",
                                      isSelectedLevel3 && "font-semibold",
                                    ].join(" ")}
                                  >
                                    {level3.level3Name}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
            {selectedCategory && (
              <Button variant="line" className="items-center">
                <span className="font-normal">
                  {selectedCategory.level3Name}
                </span>
                <span className="text-brand-mediumgray" onClick={clearCategory}>
                  <XCircle />
                </span>
              </Button>
            )}

            {hasPrice && (
              <Button variant="line" className="items-center">
                <span className="font-normal">
                  {minPrice || "0"} - {maxPrice || "상한 없음"}
                </span>
                <span
                  className="text-brand-mediumgray"
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  <XCircle />
                </span>
              </Button>
            )}

            {hasArea && (
              <Button variant="line" className="items-center">
                <span className="font-normal">{area}</span>
                <span
                  className="text-brand-mediumgray"
                  onClick={() => {
                    setArea("");
                  }}
                >
                  <XCircle />
                </span>
              </Button>
            )}
          </div>
          <div className="text-sm text-brand-darkgray underline">초기화</div>
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
