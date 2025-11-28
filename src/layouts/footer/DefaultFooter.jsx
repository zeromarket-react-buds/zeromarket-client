import Container from "@/components/Container";
import { Link } from "react-router-dom";
import logo from "@/assets/zm_logo.svg";

const DefaultFooter = () => {
  return (
    <footer className="mt-16 py-8 bg-gray-50 border-gray-200 flex items-center px-4 border-t">
      <Container>
        <div className="flex space-x-3 mb-10">
          <div className="flex-grow space-y-8">
            <div className="flex space-x-16 items-center">
              <Link to="/" className="h-[50px] shrink-0">
                <img src={logo} className="h-full" alt="logo" />
              </Link>
              <nav className="flex-grow flex items-center space-x-8 font-bold text-base">
                <Link to="/">홈</Link>
              </nav>
            </div>
            <div className="text-xs">
              <div className="text-[8pt] text-gray-500">
                COPYRIGHT &copy; 2025 ZEROMARKET KOREA. ALL RIGHTS RESERVED.
              </div>
              <div className="pt-4 flex space-x-4 text-gray-600">
                <div>멤버쉽 이용약관</div>
                <div>
                  <strong>개인정보처리방침</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs">CS Center</div>
            <div className="font-bold text-lg">1899-5214</div>
            <ul className="text-[8pt] text-gray-500">
              <li>근무시간 : 10:00 ~ 17:00</li>
              <li>점심시간 : 12:00 ~ 13:00</li>
              <li>토요일, 일요일, 공휴일 휴무</li>
            </ul>
          </div>
          <div className="space-y-2">
            <div className="text-xs">Membership</div>
            <div className="text-[8pt] text-gray-500 w-full max-w-[180px]">
              제로마켓 회원으로 가입하시면 다양한 혜택을 받으실 수 있습니다.
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default DefaultFooter;
