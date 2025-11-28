import Container from "@/components/Container";
import { ChevronLeft, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const MyProfileEditPage = () => {
  // 실제 데이터는 API로 교체 예정
  const phoneNumber = "010 - 1234 - 5678";
  const email = null;

  return (
    <Container>
      {/* 상단 헤더 ->공통 상단바로 대체됨      
      <header className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()}>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">회원 정보 설정</h1>
      </header>*/}

      {/* 프로필 영역 */}
      <section className="flex items-center gap-4 mb-10">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-brand-green flex items-center justify-center overflow-hidden">
            {/* 나중에 MyProfile에서 업로드한 이미지가 연동될 예정 */}
            <UserRound className="text-brand-ivory size-10" />
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col justify-center">
          <p className="font-bold text-lg">닉네임 표시란</p>
        </div>
      </section>

      {/* 내 정보 */}
      <section className="mb-10">
        <h2 className="font-semibold mb-3 text-base">내 정보</h2>

        <div className="border rounded-2xl p-5 flex flex-col gap-6">
          {/* 휴대폰 번호 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-brand-mediumgray">휴대폰 번호</p>
              <p className="font-semibold mt-1">{phoneNumber}</p>
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              변경하기
            </Button>
          </div>

          {/* 이메일 */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-brand-mediumgray">이메일</p>
              {email ? (
                <p className="font-semibold mt-1">{email}</p>
              ) : (
                <p className="text-brand-mediumgray mt-1">
                  등록된 이메일이 없습니다
                </p>
              )}
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              {email ? "변경하기" : "등록하기"}
            </Button>
          </div>
        </div>
      </section>

      {/* 계정 관리 */}
      <section>
        <h2 className="font-semibold mb-3 text-base">계정 관리</h2>

        <div className="border rounded-2xl p-5 flex flex-col gap-6">
          {/* 카카오 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111496.png"
                alt="kakao"
                className="w-8 h-8 rounded"
              />
              <p className="font-medium">카카오</p>
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              연동하기
            </Button>
          </div>

          {/* 네이버 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/Naver_Logotype.svg"
                alt="naver"
                className="w-8 h-8"
              />
              <p className="font-medium">네이버</p>
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              연동하기
            </Button>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default MyProfileEditPage;
