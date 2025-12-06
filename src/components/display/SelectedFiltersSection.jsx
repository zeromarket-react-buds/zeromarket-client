import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const SelectedFiltersSection = ({
  categoryName,
  minPrice,
  maxPrice,
  area,
  clearCategory,
  clearPrice,
  clearArea,
  handleClearAll,
}) => {
  const hasCategory = categoryName && categoryName.trim().length > 0;

  const hasPrice =
    (minPrice !== null && minPrice !== "" && minPrice !== undefined) ||
    (maxPrice !== null && maxPrice !== "" && maxPrice !== undefined);

  const hasArea = area && area.trim().length > 0;

  const showSection = hasCategory || hasPrice || hasArea;
  if (!showSection) return null;

  const formatMin = () => {
    if (minPrice === "" || minPrice === null || minPrice === undefined) {
      return "0";
    }
    return Number(minPrice).toLocaleString();
  };

  const formatMax = () => {
    if (maxPrice === "" || maxPrice === null || maxPrice === undefined) {
      return "상한 없음";
    }
    return Number(maxPrice).toLocaleString();
  };

  return (
    <div className="my-0.5 flex flex-col mb-4">
      <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
        선택한 필터
      </div>

      <div className="flex py-3 gap-2 flex-wrap">
        {/* 카테고리 */}
        {hasCategory && (
          <Button
            variant="line"
            type="button"
            className="items-center"
            onClick={clearCategory}
          >
            <span className="font-normal">{categoryName}</span>
            <span className="text-brand-mediumgray">
              <XCircle />
            </span>
          </Button>
        )}

        {/* 가격 */}
        {hasPrice && (
          <Button
            variant="line"
            type="button"
            onClick={clearPrice}
            className="items-center"
          >
            <span className="font-normal">
              {formatMin()} - {formatMax()}
            </span>
            <span className="text-brand-mediumgray">
              <XCircle />
            </span>
          </Button>
        )}

        {/* 지역 */}
        {hasArea && (
          <Button
            variant="line"
            type="button"
            onClick={clearArea}
            className="items-center"
          >
            <span className="font-normal">{area}</span>
            <span className="text-brand-mediumgray">
              <XCircle />
            </span>
          </Button>
        )}
      </div>

      <span
        onClick={handleClearAll}
        className="text-sm text-brand-darkgray underline justify-start cursor-pointer"
      >
        초기화
      </span>
    </div>
  );
};

export default SelectedFiltersSection;
