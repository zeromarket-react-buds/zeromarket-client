import Container from "@/components/Container";
import { Link } from "react-router-dom";
import logo from "@/assets/zm_logo.svg";
import iconLogin from "@/assets/ico_login.svg";
import iconJoin from "@/assets/ico_join.svg";
import iconCart from "@/assets/ico_cart.svg";
import iconSearch from "@/assets/ico_search.svg";
import { useAuth } from "@/hooks/AuthContext";
import { Bell, UserRound, LogIn, UserRoundPlus } from "lucide-react";
import BellWithBadge from "@/components/BellWithBadge";
import { useNotification } from "@/hooks/NotificationContext";

const DefaultHeader = () => {
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotification();

  return (
    <Container>
      <header className="border-b border-gray-200 pt-2 pb-6">
        <div className="flex space-x-16 justify-between h-20 px-4">
          <Link to="/" className="h-20 shrink-0">
            <img src={logo} className="h-full" alt="logo" />
          </Link>
          {!isAuthenticated ? (
            <div className="flex flex-row items-center">
              <div className="flex text-sm font-bold">
                <Link to="/login" className="px-3 py-2" title="로그인">
                  <LogIn className="w-8 h-8  text-brand-green" />
                  {/* <span className="w-10">로그인</span> */}
                </Link>
              </div>

              <div className="flex text-sm font-bold">
                <Link to="/join" className="px-3 py-2" title="회원가입">
                  <UserRoundPlus className="w-8 h-8  text-brand-green" />
                  {/* <span className="w-13">회원가입</span> */}
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-5">
              <span className="cursor-pointer pt-1">
                <BellWithBadge size="L" unreadCount={unreadCount} />
              </span>
              <Link to="/me" className="block w-9 h-9 shrink-0">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    className="block w-full h-full rounded-full object-cover"
                    alt="프로필"
                  />
                ) : (
                  <div className="w-full h-full p-1 rounded-full bg-brand-green flex items-center justify-center">
                    <UserRound className="text-brand-ivory size-7" />
                  </div>
                )}
              </Link>
            </div>
          )}
        </div>
      </header>
    </Container>
  );
};

export default DefaultHeader;
