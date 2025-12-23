import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { validatePhone } from "@/utils/validators";

const PhoneEditModal = ({ onClose, phone, onSubmit, isSaving }) => {
  // 임시값 보관용
  const [tempPhone, setTempPhone] = useState("");

  // 포커스용
  const inputRef = useRef(null);

  // 에러 처리용
  const [error, setError] = useState("");

  // 초기값 세팅
  useEffect(() => {
    setTempPhone(phone ?? "");
    setError("");

    // 모달 열릴 때 input에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [phone]);

  // 취소 버튼
  const handleCancel = () => {
    onClose();
  };

  // 저장 버튼
  const handleSubmit = (e) => {
    e.preventDefault();

    // 클릭 자체가 되는지 확인용
    console.log(
      "handleSubmit 클릭됨, isSaving =",
      isSaving,
      "tempPhone =",
      tempPhone
    );

    const result = validatePhone(tempPhone);

    if (!result.isValid) {
      setError(result.message);
      return;
    }

    setError("");
    onSubmit(tempPhone); // 서버로는 숫자만 전달
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <form
          className="bg-white p-6 rounded-xl z-50 w-[35em]"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <div className="text-brand-green font-semibold pb-4">
            <div>휴대폰 번호 {phone ? "변경" : "등록"}</div>
          </div>

          <Input
            value={tempPhone}
            inputMode="numeric"
            ref={inputRef}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, "");
              setTempPhone(digitsOnly);
              if (error) setError("");
            }}
          />
          {error ? (
            <p className="mt-2 text-sm text-brand-red pl-1">{error}</p>
          ) : null}

          <div className="mt-4 flex gap-2 justify-end">
            <Button
              variant="line"
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button variant="green" type="submit" disabled={isSaving}>
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhoneEditModal;
