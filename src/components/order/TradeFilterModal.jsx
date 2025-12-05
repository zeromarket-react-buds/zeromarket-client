import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SelectedFiltersSection from "@/components/order/SelectedFilterSection";
import PeriodFilterSection from "@/components/order/PeriodFilterSection";
import StatusFilterSection from "@/components/order/StatusFilterSection";

const statusOptions = [
  { label: "예약중", value: "PENDING" },
  { label: "거래완료", value: "COMPLETED" },
  { label: "거래취소", value: "CANCELED" },
  { label: "숨기기", value: "isHidden" },
];

const TradeFilterModal = ({ onClose }) => {
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [openPicker, setOpenPicker] = useState(null);

  const fromPickerRef = useRef(null);
  const toPickerRef = useRef(null);

  const toggleStatus = (value, isChecked) => {
    setSelectedStatuses((prev) => {
      if (isChecked) {
        // 새로 체크해서 배열에 추가
        if (prev.includes(value)) return prev;
        return [...prev, value];
      }
      // 체크 해제하면 배열에서 제거
      return prev.filter((v) => v !== value);
    });
  };

  const handleFromChange = (date) => {
    // 날짜를 선택 취소할 때의 방어 로직
    if (!date) {
      setFromDate(null);
      return;
    }

    setFromDate(date);

    // 종료일이 이미 있고, 시작일이 더 늦으면 종료일을 자동으로 맞춰줌
    if (toDate && date > toDate) {
      setToDate(date);
    }

    setOpenPicker(null); // 캘린더 닫기
  };

  const handleToChange = (date) => {
    if (!date) {
      setToDate(null);
      return;
    }

    setToDate(date);

    // 시작일이 이미 있고, 종료일이 더 이르면 시작일을 자동으로 맞춰줌
    if (fromDate && date < fromDate) {
      setFromDate(date);
    }

    setOpenPicker(null); // 캘린더 닫기
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
        {/* 헤더 */}
        <div className="flex gap-3 justify-between items-center border-b border-brand-mediumgray mb-5 pt-0.5 pb-2">
          <div className="w-full text-base font-semibold">검색필터</div>
          <Button type="button" onClick={onClose} className="text-base -mr-2">
            <XCircle />
          </Button>
        </div>

        {/* 필터 옵션*/}
        <div className="flex flex-col gap-4 px-3 border border-dashed rounded-2xl">
          <div className="items-center justify-center text-sm text-black">
            {/* 거래/상품 필터 */}
            <StatusFilterSection
              statusOptions={statusOptions}
              selectedStatuses={selectedStatuses}
              toggleStatus={toggleStatus}
            />

            {/* 기간 필터 */}
            <PeriodFilterSection
              fromDate={fromDate}
              toDate={toDate}
              handleFromChange={handleFromChange}
              handleToChange={handleToChange}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              fromPickerRef={fromPickerRef}
              toPickerRef={toPickerRef}
              formatDate={formatDate}
            />
          </div>
        </div>

        {/* 선택한 필터 */}
        {isOpen && (
          <SelectedFiltersSection
            isOpen={isOpen}
            hasStatus={hasStatus}
            hasPeriod={hasPeriod}
            selectedStatuses={selectedStatuses}
            statusOptions={statusOptions}
            formatDate={formatDate}
            fromDate={fromDate}
            toDate={toDate}
            clearPeriod={clearPeriod}
            removeStatus={removeStatus}
            handleClearAll={handleClearAll}
          />
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

export default TradeFilterModal;
