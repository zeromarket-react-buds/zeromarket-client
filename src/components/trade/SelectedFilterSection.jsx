import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const SelectedFiltersSection = ({
  isOpen,
  hasStatus,
  hasPeriod,
  selectedStatuses,
  statusOptions,
  formatDate,
  fromDate,
  toDate,
  clearPeriod,
  removeStatus,
  handleClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="my-2 flex flex-col mb-4">
      <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
        선택한 필터
      </div>
      <div className="flex py-3 gap-2 flex-wrap">
        {hasStatus &&
          selectedStatuses.map((value) => {
            const option = statusOptions.find((o) => o.value === value);
            if (!option) return null;

            return (
              <Button
                key={value}
                variant="line"
                type="button"
                className="items-center"
                onClick={() => removeStatus(value)}
              >
                <span className="font-normal">{option.label}</span>
                <span className="text-brand-mediumgray ml-1">
                  <XCircle />
                </span>
              </Button>
            );
          })}

        {hasPeriod && (
          <Button
            variant="line"
            type="button"
            onClick={clearPeriod}
            className="items-center"
          >
            <span className="font-normal">
              {formatDate(fromDate) || "시작일 설정 없음"} -{" "}
              {formatDate(toDate) || "종료일 설정 없음"}
            </span>
            <span className="text-brand-mediumgray ml-1">
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
