import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const PhoneEditModal = ({ onClose, phone, onSubmit, isSaving }) => {
  // 임시값 보관용
  const [tempPhone, setTempPhone] = useState("");

  // 초기값 세팅
  useEffect(() => {
    setTempPhone(phone ?? "");
  }, [phone]);

  // 취소 버튼
  const handleCancel = () => {
    onClose();
  };

  // 저장 버튼
  const handleSubmit = () => {
    onSubmit(tempPhone);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white p-6 rounded-xl z-50 w-[35em]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-brand-green font-semibold pb-4">
            <div>휴대폰 번호 {phone ? "변경" : "등록"}</div>
          </div>

          <Input
            value={tempPhone}
            onChange={(e) => setTempPhone(e.target.value)}
          />

          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="line"
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              variant="green"
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
            >
              저장하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneEditModal;
