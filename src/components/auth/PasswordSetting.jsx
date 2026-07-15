import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { setPasswordApi } from "@/common/api/auth.api";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import { validatePassword } from "@/utils/validators";

const PasswordSetting = ({ loginId }) => {
  const navigate = useNavigate();
  const { alert } = useModal();

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRedo, setNewPasswordRedo] = useState("");

  const newPasswordRef = useRef(null);
  const newPasswordRedoRef = useRef(null);
  const newPasswordBtnRef = useRef(null);

  const [validation, setValidation] = useState("");

  const [result, setResult] = useState("");

  // 일치 검증
  const validatePasswordMatch = (password, passwordRedo) => {
    if (!passwordRedo) {
      setValidation("");
    } else if (password !== passwordRedo) {
      setValidation("비밀번호가 일치하지 않습니다.");
    } else {
      setValidation("");
    }
  };

  const submitNewPassword = async () => {
    setValidation("");

    if (!newPassword.trim() || !newPasswordRedo.trim()) {
      await alert({
        description: "변경할 비밀번호를 모두 입력해주세요.",
      });

      if (!newPassword.trim()) {
        newPasswordRef.current?.focus();
      } else {
        newPasswordRedoRef.current?.focus();
      }

      return;
    }

    // 비밀번호 형식 검증(영문/숫자 포함, 8자 이상)
    const passwordResult = validatePassword(newPassword);

    if (!passwordResult.isValid) {
      setValidation(passwordResult.message);
      newPasswordRef.current?.focus();
      return;
    }

    if (newPassword !== newPasswordRedo) {
      setValidation("비밀번호가 일치하지 않습니다.");
      newPasswordRedoRef.current?.focus();
      return;
    }

    await setPasswordApi({
      loginId,
      newPassword,
    });

    setResult({
      status: "success",
      messages: [
        <div className="flex flex-col gap-2">
          <span className="font-bold">고객님의 비밀번호가 변경되었습니다.</span>
          새 비밀번호로 로그인해주세요.
        </div>,
      ],
    });
  };

  return (
    <>
      {!result ? (
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
              onChange={(e) => {
                const value = e.target.value;
                setNewPassword(value);
                validatePasswordMatch(value, newPasswordRedo);
              }}
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
              onChange={(e) => {
                const value = e.target.value;
                setNewPasswordRedo(value);
                validatePasswordMatch(newPassword, value);
              }}
              className="w-full border rounded-xl my-5 py-2 px-4 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  newPasswordBtnRef.current?.focus();
                }
              }}
            />
            <div className="text-brand-red -mt-4 mb-4">{validation}</div>
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
      ) : (
        <div className="w-full border rounded-2xl p-6">
          {/* 결과 영역 */}
          {result.status === "success" && (
            <>
              {result.messages.map((msg) => (
                <p>{msg}</p>
              ))}

              <div className="mt-4 flex justify-center">
                <Button
                  variant="green"
                  className="px-6"
                  onClick={() => navigate("/login")}
                >
                  로그인
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default PasswordSetting;
