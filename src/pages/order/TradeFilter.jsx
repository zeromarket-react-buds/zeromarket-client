// src/components/order/TradeFilter.jsx

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const TradeFilter = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      />

      {/* 모달창 */}
      <div className="bg-white p-6 rounded-xl z-50 w-[35em] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="w-full text-base font-semibold">검색필터</div>
          <button
            type="button"
            className="text-sm text-gray-500"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        {/* 필터 옵션*/}
        <div className="flex flex-col gap-3">
          <div className="h-20 items-center justify-center text-sm text-gray-500">
            필터 옵션 영역
          </div>
        </div>

        <Button
          type="submit"
          variant="green"
          className="px-3 py-2 w-full"
          onClick={onClose}
        >
          적용
        </Button>
      </div>
    </div>
  );
};

export default TradeFilter;
