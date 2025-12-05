import { ChevronLeft, Share2, User, LogIn } from "lucide-react";
import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";
import { useAuth } from "@/hooks/AuthContext";

const AuthStatusIcon = ({ isAuthenticated, navigate }) => (
  <button
    className="w-10 h-10 cursor-pointer flex items-center justify-center"
    onClick={() => navigate(isAuthenticated ? "/mypage" : "/login")}
    title={isAuthenticated ? "마이페이지" : "로그인"}
  >
    {/* 현재 로그인상태 확인용 임의 코드 - 추후 삭제예정 */}
    {isAuthenticated ? (
      <User className="text-brand-green" size={20} /> // 로그인 상태
    ) : (
      <LogIn className="text-gray-500" size={20} /> // 비로그인 상태
    )}
  </button>
);

const ProductHeader = ({ type }) => {
  const { headerState } = useHeader();
  const { isAuthenticated } = useAuth();
  const detail = headerState?.detail;
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: detail?.productTitle || "제로마켓 상품",
          text: detail?.productDescription || "제로마켓 상품을 확인해보세요!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("공유 실패:", err);
      }
    } else {
      // navigator.share 미지원시 > URL 클립보드 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("URL이 클립보드에 복사되었습니다!");
      } catch (err) {
        console.error("클립보드 복사 실패함:", err);
        alert("공유 기능을 사용할 수 없습니다.");
      }
    }
  };

  return (
    <Container>
      {/* 상품 등록 상단바 */}
      {type === "register" && (
        <header className="flex justify-between items-center px-2 pt-4 ">
          <button className="w-15 h-10 cursor-pointer">
            <ChevronLeft
              className="p-0.3 ml-4 stroke-3"
              onClick={() => navigate(-1)}
            />
          </button>
          <span className="text-xl font-semibold">상품 등록</span>
          <button className="text-sm font-semibold text-gray-500 w-15 h-10  mr-4 cursor-pointer">
            임시 저장
          </button>
          <AuthStatusIcon
            isAuthenticated={isAuthenticated}
            navigate={navigate}
          />
        </header>
      )}

      {/* 상품 상세 상단바 */}
      {type === "detail" && (
        <header className="flex justify-between items-center px-2 pt-2">
          <button
            className="w-15 h-10 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="p-0.3 ml-4 stroke-3" />
          </button>
          <button className="w-15 h-10 cursor-pointer" onClick={handleShare}>
            <Share2 className="m-2 mr-3 text-gray-800" />
          </button>
          <AuthStatusIcon
            isAuthenticated={isAuthenticated}
            navigate={navigate}
          />
        </header>
      )}

      {/* 상품 수정 상단바 */}
      {type === "edit" && (
        <header className="flex justify-between items-center px-2 pt-4 ">
          <button className="w-15 h-10 cursor-pointer">
            <ChevronLeft
              className="p-0.3 ml-4 stroke-3"
              onClick={() => navigate(-1)}
            />
          </button>
          <span className="text-xl font-semibold">상품 수정</span>
          <button className="text-sm font-semibold text-gray-500 w-15 h-10  mr-4 cursor-pointer">
            임시 저장
          </button>
          <AuthStatusIcon
            isAuthenticated={isAuthenticated}
            navigate={navigate}
          />
        </header>
      )}
    </Container>
  );
};

export default ProductHeader;
