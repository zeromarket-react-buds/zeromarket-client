import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { GreenCheckBox } from "@/components/ui/greencheckbox";
import { useState, useRef, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";

const statusOptions = [
  { label: "예약중", value: "PENDING" },
  { label: "거래완료", value: "COMPLETED" },
  { label: "거래취소", value: "CANCELED" },
  { label: "숨기기", value: "isHidden" },
];

const TradeFilter = ({ onClose }) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [openPicker, setOpenPicker] = useState();
  const fromPickerRef = useRef();
  const toPickerRef = useRef();

  const toggleStatus = (value, isChecked) => {
    setSelectedStatuses((prev) => {
      if (isChecked) {
        // 새로 체크해서 배열에 추가
        if (prev.includes(value)) return prev;
        return [...prev, value];
      } else {
        // 체크 해제하면 배열에서 제거
        return prev.filter((v) => v !== value);
      }
    });
  };

  // 선택 여부
  const hasStatus = selectedStatuses.length > 0;
  const hasPeriod = fromDate !== null || toDate !== null;
  const isOpen = hasStatus || hasPeriod;

  // 상태만 초기화
  const clearStatus = () => {
    setSelectedStatuses([]);
  };

  // 개별 상태 초기화
  const removeStatus = (value) => {
    setSelectedStatuses((prev) => prev.filter((v) => v !== value));
  };

  // 기간 초기화
  const clearPeriod = () => {
    setFromDate(null);
    setToDate(null);
  };

  // 전체 초기화
  const handleClearAll = (e) => {
    e.preventDefault();
    e.stopPropagation();

    clearStatus();
    clearPeriod();
  };

  const formatDate = (date) => (date ? date.toLocaleDateString("ko-KR") : "");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!openPicker) return;

      // 시작일 영역 안을 클릭한 경우는 유지
      if (
        fromPickerRef.current &&
        fromPickerRef.current.contains(event.target)
      ) {
        return;
      }

      // 종료일 영역 안을 클릭한 경우는 유지
      if (toPickerRef.current && toPickerRef.current.contains(event.target)) {
        return;
      }

      // 둘 다 아닌 곳이면 달력 닫기
      setOpenPicker(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPicker]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      />

      {/* 모달창 */}
      <div className="bg-white p-6 rounded-xl z-50 w-[35em]">
        <div className="flex gap-3 justify-between items-center border-b border-brand-mediumgray mb-5 pt-0.5 pb-2">
          <div className="w-full text-base font-semibold">검색필터</div>
          <Button type="button" onClick={onClose} className="text-base -mr-2">
            <XCircle />
          </Button>
        </div>

        {/* 필터 옵션*/}
        <div className="flex flex-col gap-4 px-3 border border-dashed rounded-2xl">
          <div className="items-center justify-center text-sm text-black">
            <div className="flex flex-col gap-3 py-3">
              {/* 거래/상품 필터 */}
              <div className="text-base font-semibold px-3">
                거래 · 상품상태
              </div>

              <div>
                <div className="flex gap-4">
                  {statusOptions.map((option, idx) => (
                    <Button
                      key={idx}
                      type="button"
                      className="text-black font-normal"
                    >
                      <GreenCheckBox
                        label={option.label}
                        value={option.value}
                        name="tradeStatus"
                        checked={selectedStatuses.includes(option.value)}
                        onChange={(isChecked) =>
                          toggleStatus(option.value, isChecked)
                        }
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 기간 필터 */}
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
                        onSelect={(date) => {
                          setFromDate(date);
                          setOpenPicker(null);
                        }}
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
                        onSelect={(date) => {
                          setToDate(date);
                          setOpenPicker(null);
                        }}
                        className="rounded-md border shadow-sm"
                        captionLayout="dropdown"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 선택한 필터 */}
        {isOpen && (
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
        )}

        {/* 적용 버튼 */}
        <div className="mt-3">
          <Button
            type="submit"
            variant="green"
            className="px-3 py-2 mt-5 w-full"
          >
            적용
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeFilter;
