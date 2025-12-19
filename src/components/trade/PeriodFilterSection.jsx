import { Button } from "@/components/ui/button";
import { Calendar } from "../ui/calendar";

const PeriodFilterSection = ({
  fromDate,
  toDate,
  handleFromChange,
  handleToChange,
  openPicker,
  setOpenPicker,
  fromPickerRef,
  toPickerRef,
  formatDate,
}) => {
  return (
    <div className="flex flex-col gap-3 py-3 px-3">
      <div className="text-base font-semibold">기간</div>

      <div className="flex w-full items-center gap-4">
        {/* 시작일 */}
        <div className="relative flex-1" ref={fromPickerRef}>
          <Button
            type="button"
            variant="line"
            className="font-normal w-full justify-between"
            onClick={() =>
              setOpenPicker((prev) => (prev === "from" ? null : "from"))
            }
          >
            {fromDate ? formatDate(fromDate) : "시작일"}
          </Button>

          {openPicker === "from" && (
            <div className="absolute mt-2 z-50 border border-brand-mediumgray rounded-md bg-white shadow-lg">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={handleFromChange}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </div>
          )}
        </div>

        <span>-</span>

        {/* 종료일 */}
        <div className="relative flex-1" ref={toPickerRef}>
          <Button
            type="button"
            variant="line"
            className="font-normal w-full justify-between"
            onClick={() =>
              setOpenPicker((prev) => (prev === "to" ? null : "to"))
            }
          >
            {toDate ? formatDate(toDate) : "종료일"}
          </Button>

          {openPicker === "to" && (
            <div className="absolute mt-2 z-50 border border-brand-mediumgray rounded-md bg-white shadow-lg">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={handleToChange}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodFilterSection;
