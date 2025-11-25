import Container from "@/components/Container";
import { Link } from "react-router-dom";
import logo from "@/assets/zm_logo.svg";
import iconLogin from "@/assets/ico_login.svg";
import iconJoin from "@/assets/ico_join.svg";
import iconCart from "@/assets/ico_cart.svg";
import iconSearch from "@/assets/ico_search.svg";

const DefaultHeader = () => {
  return (
    <Container>
      <header className="border-b border-gray-200 py-4">
        <div className="h-[30px] space-x-4 flex justify-end items-center text-gray-500 text-xs">
          <Link to="/" className="hover:text-black hover:underline">
            홈
          </Link>
          <Link to="/me" className="hover:text-black hover:underline">
            마이페이지
          </Link>
        </div>
        <div className="flex space-x-16 items-center h-[60px]">
          <Link to="/" className="h-[50px] shrink-0">
            <img src={logo} className="h-full" alt="logo" />
          </Link>
          <div className="flex-grow"></div>
          <div className="flex space-x-3 items-center mr-4">
            <div className="flex text-sm font-bold rounded-lg text-white bg-[#203864]">
              <Link
                to="/boards"
                className="flex space-x-1 items-center px-3 py-2"
              >
                <img
                  src={iconLogin}
                  alt="cart"
                  className="text-white w-5 h-5"
                />
                <span>게시판</span>
              </Link>
            </div>
            <div className="flex text-sm font-bold rounded-lg text-white bg-[#203864]">
              <Link
                to="/login"
                className="flex space-x-1 items-center px-3 py-2"
              >
                <img
                  src={iconLogin}
                  alt="cart"
                  className="text-white w-5 h-5"
                />
                <span>로그인</span>
              </Link>
            </div>

            <div className="flex text-sm font-bold rounded-lg text-white bg-[#203864]">
              <Link
                to="/join"
                className="flex space-x-1 items-center px-3 py-2"
              >
                <img src={iconJoin} alt="cart" className="text-white w-5 h-5" />
                <span>회원가입</span>
              </Link>
            </div>
            <Link to="/shopping/cart" className="relative cursor-pointer">
              <img src={iconCart} alt="cart" className="w-5 h-5" />
              <div className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full bg-[#0063ba] flex items-center justify-center">
                <div className="text-white text-[8pt] font-bold">0</div>
              </div>
            </Link>
            <div className="cursor-pointer">
              <img src={iconSearch} alt="search" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>
    </Container>
  );
};

export default DefaultHeader;
