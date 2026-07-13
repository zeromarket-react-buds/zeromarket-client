import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const PasswordSetting = ({ loginId }) => {
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRedo, setNewPasswordRedo] = useState("");

  const newPasswordRef = useRef(null);
  const newPasswordRedoRef = useRef(null);
  const newPasswordBtnRef = useRef(null);

  const submitNewPassword = () => {};

  return (
    <form
      className="w-full border rounded-2xl p-6 mb-2"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* 변경할 비밀번호 입력 영역 */}
      <div>
        <span className="flex justify-between">
          변경할 비밀번호를 입력해주세요.
        </span>

        <input
          ref={newPasswordRef}
          type="password"
          placeholder="변경할 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded-xl my-5 py-2 px-4 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              newPasswordRedoRef.current?.focus();
            }
          }}
        />
      </div>

      {/* 변경할 비밀번호 확인 영역 */}
      <div>
        <span className="flex justify-between">
          변경할 비밀번호를 다시 한 번 입력해주세요.
        </span>

        <input
          ref={newPasswordRedoRef}
          type="password"
          placeholder="변경할 비밀번호 확인"
          value={newPasswordRedo}
          onChange={(e) => setNewPasswordRedo(e.target.value)}
          className="w-full border rounded-xl my-5 py-2 px-4 text-base"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              newPasswordBtnRef.current?.focus();
            }
          }}
        />
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center">
        <Button
          type="button"
          ref={newPasswordBtnRef}
          variant="green"
          className="px-6"
          onClick={submitNewPassword}
        >
          비밀번호 변경
        </Button>
      </div>
    </form>
  );
};

export default PasswordSetting;
