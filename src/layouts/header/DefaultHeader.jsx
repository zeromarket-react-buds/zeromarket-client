import Container from "@/components/Container";
import { Link } from "react-router-dom";
import logo from "@/assets/zm_logo.svg";
import iconLogin from "@/assets/ico_login.svg";
import iconJoin from "@/assets/ico_join.svg";
import iconCart from "@/assets/ico_cart.svg";
import iconSearch from "@/assets/ico_search.svg";
import { useAuth } from "@/hooks/AuthContext";
import { Bell, UserRound } from "lucide-react";

const DefaultHeader = () => {
  const { user, isAuthenticated } = useAuth();
  console.log("user", user);

  return (
    <Container>
      <header className="border-b border-gray-200 py-4">
        <div className="flex space-x-16 justify-between h-[60px] px-4">
          <Link to="/" className="h-[50px] shrink-0">
            <img src={logo} className="h-full" alt="logo" />
          </Link>
          {!isAuthenticated ? (
            <div className="flex flex-row items-center">
              <div className="flex text-sm font-bold">
                <Link to="/login" className="px-3 py-2">
                  <span className="w-10">로그인</span>
                </Link>
              </div>

              <div className="flex text-sm font-bold">
                <Link to="/join" className="px-3 py-2">
                  <span className="w-13">회원가입</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center gap-5">
              <Bell className="w-9 h-9" />
              <Link to="/me" className="">
                {user?.profileImage ? (
                  <img
                    src={user?.profileImage}
                    className="w-9 h-9 rounded-full"
                  />
                ) : (
                  <UserRound className="w-9 h-9 bg-brand-green rounded-full text-brand-ivory" />
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
