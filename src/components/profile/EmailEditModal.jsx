import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { validateEmail } from "@/utils/validators";

const EmailEditModal = ({ onClose, email, onSubmit, isSaving }) => {
  // 임시값 보관용
  const [tempEmail, setTempEmail] = useState("");

  // 포커스용
  const inputRef = useRef(null);

  // 에러 처리용
  const [error, setError] = useState("");

  // 초기값 세팅
  useEffect(() => {
    setTempEmail(email ?? "");
    setError("");

    // 모달 열릴 때 input에 포커스
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [email]);

  // 취소 버튼
  const handleCancel = () => {
    onClose();
  };

  // 저장 버튼
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateEmail(tempEmail);

    if (!result.isValid) {
      setError(result.message);
      return;
    }

    setError("");
    onSubmit(tempEmail); // 공란도 그대로 넘김 (삭제 의도)
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
            <div>이메일 {email ? "변경" : "등록"}</div>
          </div>

          <Input
            value={tempEmail}
            ref={inputRef}
            onChange={(e) => {
              setTempEmail(e.target.value);
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

export default EmailEditModal;
