import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XCircle } from "lucide-react";
import { Search } from "lucide-react";

const FilterSideBar = () => {
  return (
    <div className="flex p-2">
      <div className="flex flex-col gap-3 p-2 w-full">
        <div className="flex gap-3 items-center border-b border-brand-mediumgray py-3">
          <div className="w-full text-base font-semibold">검색필터</div>
          <Button className="text-base pr-2">
            <XCircle />
          </Button>
        </div>
        <div className="flex flex-col gap-3 my-3">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-3">
            카테고리
          </div>
          <div className="bg-brand-lightgray text-brand-darkgray flex flex-col p-4">
            <div>1차 카테고리</div>
            <div>2차 카테고리</div>
            <div>3차 카테고리</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 my-3">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-3">
            가격
          </div>
          <div className="flex w-full items-center gap-2">
            <Input className="font-normal" placeholder="최소 가격" />
            <span>-</span>
            <Input className="font-normal" placeholder="최대 가격" />
          </div>
        </div>
        <div className="flex flex-col text-base font-semibold gap-3 my-3">
          <div className="border-b border-brand-mediumgray py-3">지역</div>
          <div className="relative w-full">
            <Button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
            >
              <Search />
            </Button>
            <Button className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4">
              <XCircle />
            </Button>
            <Input className="font-normal" placeholder="지역을 입력해주세요" />
          </div>
          <Button variant="ivory">현재 내 위치</Button>
        </div>
        <div className="my-3">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-3">
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
        <div className="flex flex-row gap-3 w-full border-t border-brand-mediumgray py-4">
          <Button variant="ivory" className="flex-1">
            전체 해제
          </Button>
          <Button variant="gray" className="flex-1">
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
