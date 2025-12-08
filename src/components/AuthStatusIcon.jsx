import { User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/AuthContext";

const AuthStatusIcon = ({ isAuthenticated, navigate }) => {
  const goMypage = () => {
    navigate("/me");
  };
  const goLogin = () => {
    navigate("/login");
  };
  return (
    <button
      className="w-10 h-10 cursor-pointer flex items-center justify-center"
      title={isAuthenticated ? "로그인중" : "미로그인"}
    >
      {/* 현재 로그인상태 확인용 임의 코드 - 추후 삭제예정 */}
      {isAuthenticated ? (
        <User className="text-brand-green" size={20} onClick={goMypage}></User>
      ) : (
        <LogIn className="text-gray-500" size={20} onClick={goLogin} /> // 비로그인 상태
      )}
    </button>
  );
};

export default AuthStatusIcon;
