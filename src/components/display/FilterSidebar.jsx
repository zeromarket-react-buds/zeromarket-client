import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";

const FilterSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [area, setArea] = useState("");
  const inputRef = useRef(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
    <div className="flex flex-col gap-3 w-full">
      {/* 카테고리 */}
      <div className="flex flex-col gap-3 my-0.5">
        <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
          카테고리
        </div>
        <div className="bg-brand-lightgray text-brand-darkgray flex flex-col p-4">
          <div>1차 카테고리</div>
          <div>2차 카테고리</div>
          <div>3차 카테고리</div>
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
