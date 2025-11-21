import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FilterSideBar = () => {
  return (
    <div className="flex p-2">
      <div className="flex flex-col gap-3 p-2 w-full">
        <div className="flex gap-3 border-b border-brand-mediumgray py-3">
          <div className="w-full text-base font-semibold">검색필터</div>
          <div className="text-base font-semibold pr-2">×</div>
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
          <div className="border-b border-brand-mediumgray pb-2">지역</div>
          <Input className="font-normal" placeholder="지역을 입력해주세요" />
          <Button className="font-semibold  bg-brand-ivory text-brand-green border border-brand-green">
            현재 내 위치
          </Button>
        </div>
        <div className="my-3">
          <div className="text-base font-semibold border-b border-brand-mediumgray py-3">
            선택한 필터
          </div>
          <div className="flex flex-row gap-2 py-3">
            <Button className="bg-white text-black border border-brand-mediumgray">
              <span>역삼동</span>
              <span>×</span>
            </Button>
            <Button className="bg-white text-black border border-brand-mediumgray">
              <span>0 - 20,000</span>
              <span>×</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-row gap-3 w-full border-t border-brand-mediumgray py-4">
          <Button className="flex-1 font-semibold bg-brand-ivory text-brand-green border border-brand-green">
            전체 해제
          </Button>
          <Button className="flex-1 font-semibold bg-brand-mediumgray">
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
