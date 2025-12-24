import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";

const AreaFilterSection = ({ area, setArea, areaRef }) => {
  const clearAreaInput = (e) => {
    e.preventDefault(); // submit 방지
    e.stopPropagation(); // 이벤트버블링 방지
    setArea("");
  };

  return (
    <div className="flex flex-col text-base font-semibold gap-4 mt-0.5 mb-3">
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
          type="button"
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
    </div>
  );
};

export default AreaFilterSection;
