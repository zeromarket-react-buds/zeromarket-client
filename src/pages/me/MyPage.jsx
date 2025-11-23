import { ChevronLeft, Bell, UserRoundPen, Heart, Pen } from "lucide-react";

export default function MyPage() {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between mb-6">
        <button>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">마이페이지</h1>
        <button>
          <Bell size={24} />
        </button>
      </header>

      {/* 프로필 */}
      <section className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#1B6439" }}
        >
          <UserRoundPen className="text-white" size={30} strokeWidth={2} />
        </div>
        <div className="text-lg font-semibold">닉네임 표시란</div>
      </section>

      {/* 점수 카드 */}
      <section className="border rounded-2xl p-4 mb-2">
        <div className="flex justify-between mb-2 text-[16px]">
          <span>신뢰점수</span>
          <span className="text-[#1B6439] font-bold text-lg text-[20px]">
            4.5
          </span>
        </div>
        <div className="flex justify-between text-[16px]">
          <span>환경점수</span>
          <span className="text-[#1B6439] font-bold text-lg text-[20px]">
            4,000
          </span>
        </div>
      </section>

      <p className="text-sm text-gray-500 text-center mb-6">
        환경점수는 어떻게 사용할 수 있나요?
      </p>

      {/* 한줄 소개 */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2 text-[16px]">한줄 소개</h2>
        <div className="border rounded-2xl p-3 text-gray-700 text-[16px]">
          빠른 확인 가능합니다
        </div>
      </section>

      {/* 메뉴 리스트 */}
      <section className="border rounded-2xl p-4 mb-6">
        <ul className="space-y-4 text-gray-800 text-[18px]">
          <li>프로필 설정</li>
          <li>회원 정보 설정</li>
          <li>판매 내역</li>
          <li>구매 내역</li>
          <li>채팅 목록</li>
          <li>차단 유저 목록</li>
        </ul>
      </section>

      {/* 찜 & 후기 */}
      <section className="border rounded-2xl p-4 flex justify-around text-center">
        <div className="flex flex-col items-center">
          <Heart color="#1B6439" size={32} className="mx-auto mb-2.5" />
          <div className="flex items-center gap-2">
            <span>찜 목록</span>
            <span className="font-bold text-[#1B6439]">1</span>
            <span className="text-black">건</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Pen color="#1B6439" size={32} className="mx-auto mb-2.5" />
          <div className="flex items-center gap-2">
            <span>받은 후기</span>
            <span className="font-bold text-[#1B6439]">3</span>
            <span className="text-black">건</span>
          </div>
        </div>
      </section>
    </div>
  );
}
