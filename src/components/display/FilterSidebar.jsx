import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const category = [
  {
    id: "luxury",
    name: "수입명품",
    children: [
      {
        id: "luxury-women-shoes",
        name: "여성신발",
        children: [
          { id: "sneakers", name: "운동화/스니커즈" },
          { id: "sandal", name: "샌들/슬리퍼" },
          { id: "loafer", name: "구두/로퍼" },
        ],
      },
    ],
  },
  {
    id: "men-shoes",
    name: "남성신발",
    children: [
      {
        id: "men-casual",
        name: "캐주얼화",
        children: [
          { id: "men-sneakers", name: "운동화/스니커즈" },
          { id: "men-sandal", name: "샌들/슬리퍼" },
        ],
      },
      {
        id: "men-dressshoe",
        name: "정장구두",
        children: [
          { id: "men-dressshoe-ko", name: "국내구두" },
          { id: "men-sneakers-global", name: "해외구두" },
        ],
      },
    ],
  },
];

const FilterSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [area, setArea] = useState("");
  const inputRef = useRef(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 펼쳐진 1,2차 카테고리
  const [openLevel1Id, setOpenLevel1Id] = useState(null);
  const [openLevel2Id, setOpenLevel2Id] = useState(null);

  // 선택된 카테고리 상태
  const [selectedLevel1, setSelectedLevel1] = useState(null);
  const [selectedLevel2, setSelectedLevel2] = useState(null);
  const [selectedLevel3, setSelectedLevel3] = useState(null);

  // 1차 카테고리 클릭 열기/접기
  const toggleLevel1 = (id) => {
    setOpenLevel1Id((prev) => (prev === id ? null : id));
  };

  // 2차 선택, 카테고리 클릭 열기/접기
  const handleSelectLevel2 = (l1Id, l2Id) => {
    setOpenLevel2Id((prev) => (prev === l2Id ? null : l2Id));
    setSelectedLevel1(l1Id);
    setSelectedLevel2(l2Id);
  };

  // 3차 선택
  const handleSelectLevel3 = (l1Id, l2Id, l3Id) => {
    setSelectedLevel1(l1Id);
    setSelectedLevel2(l2Id);
    setSelectedLevel3(l3Id);
  };

  const handleMinPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMinPrice(numeric);
  };

  const handleMaxPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMaxPrice(numeric);
  };

  const clearInput = (e) => {
    e.preventDefault(); // submit 방지
    e.stopPropagation(); // 이벤트버블링 방지
    setArea("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 카테고리 */}
      <div className="flex flex-col gap-3">
        <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
          카테고리
        </div>

        {/* 바깥 카테고리 박스 */}
        <div className="bg-brand-lightgray border -mt-3">
          {category.map((level1) => {
            const isOpenCategory2 = openLevel1Id === level1.id;
            return (
              <div key={level1.id} className="border last:border-b-0">
                {/* 1차 카테고리 */}
                <button
                  type="button"
                  onClick={() => toggleLevel1(level1.id)}
                  className="flex border-brand-darkgray w-full items-center justify-between px-6 py-2 text-left "
                >
                  <span className="text-brand-darkgray text-sm">
                    {level1.name}
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
                      const isOpenCategory3 = openLevel2Id === level2.id;

                      return (
                        <div key={level2.id} className="pl-6">
                          {/* 2차 */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectLevel2(level1.id, level2.id)
                            }
                            className="flex w-full items-center justify-between py-2 text-left text-sm pr-3"
                          >
                            <span className="text-brand-darkgray text-sm">
                              {level2.name}
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
                                  selectedLevel3 === level3.id;

                                return (
                                  <button
                                    key={level3.id}
                                    type="button"
                                    onClick={() =>
                                      handleSelectLevel3(
                                        level1.id,
                                        level2.id,
                                        level3.id
                                      )
                                    }
                                    className={[
                                      "block w-full text-left py-1.5 text-brand-darkgray text-sm",
                                      isSelectedLevel3 && "font-semibold",
                                    ].join(" ")}
                                  >
                                    {level3.name}
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
          />
          <span>-</span>
          <Input
            onChange={handleMaxPrice}
            inputMode="numeric"
            value={maxPrice}
            className="font-normal"
            placeholder="최대 가격"
          />
        </div>
      </div>

      {/* 지역 */}
      <div className="flex flex-col text-base font-semibold gap-3 my-0.5">
        <div className="border-b border-brand-mediumgray py-2">지역</div>
        <div className="relative w-full">
          <Input
            value={area}
            ref={inputRef}
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
              onClick={clearInput}
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
        <div className="my-0.5">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
            선택한 필터
          </div>
          <div className="flex flex-row gap-2 py-3">
            <Button variant="line">
              <span className="font-normal">역삼동</span>
              <span className="text-brand-mediumgray">
                <XCircle />
              </span>
            </Button>
            <Button variant="line">
              <span className="font-normal">0 - 20,000</span>
              <span className="text-brand-mediumgray">
                <XCircle />
              </span>
            </Button>
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
