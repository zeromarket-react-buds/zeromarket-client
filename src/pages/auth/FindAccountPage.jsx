import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const FindAccountPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");

  const [openFindId, setOpenFindId] = useState(initialTab === "id");
  const [openFindPass, setOpenFindPass] = useState(initialTab === "password");

  return (
    <Container>
      {/* 탭 영역 */}
      <div className="flex border-b -mt-5">
        {/* 아이디 찾기 */}
        <div
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            openFindId
              ? "border-brand-green text-brand-green"
              : "border-transparent  text-brand-mediumgray"
          }`}
          disabled
          onClick={() => {
            (setOpenFindId(true), setOpenFindPass(false));
          }}
        >
          아이디 찾기
        </div>

        {/* 비밀번호 찾기 */}
        <div
          className={`flex-1 text-center py-2 font-medium border-b-2 ${
            openFindPass
              ? "border-brand-green text-brand-green"
              : "border-transparent text-brand-mediumgray"
          }`}
          onClick={() => {
            (setOpenFindId(false), setOpenFindPass(true));
          }}
        >
          비밀번호 찾기
        </div>
      </div>
      {/* 폼 영역 */}
      <form className="border rounded-2xl p-6 mb-2">
        {openFindPass && (
          <div>
            <span className="flex justify-between">아이디를 입력해주세요.</span>
            <input
              placeholder="아이디"
              className="w-full border rounded-xl my-5 py-2 px-4 text-base"
            />
          </div>
        )}
        <div>
          <span className="flex justify-between">이름을 입력해주세요.</span>
          <input
            placeholder="이름"
            className="w-full border rounded-xl my-5 py-2 px-4 text-base"
          />
        </div>
        <div>
          <span className="flex justify-between">전화번호를 입력해주세요.</span>
          <input
            placeholder="전화번호"
            className="w-full border rounded-xl my-5 py-2 px-4 text-base"
          />
        </div>
        {/* 버튼 영역 */}
        <div className="flex justify-center">
          {openFindId && (
            <Button variant="green" className="px-6">
              아이디 찾기
            </Button>
          )}
          {openFindPass && (
            <Button variant="green" className="px-6">
              비밀번호 찾기
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
};

export default FindAccountPage;
