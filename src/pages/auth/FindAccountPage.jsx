import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const FindAccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab");

  const idRef = useRef(null);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const findIdBtnRef = useRef(null);
  const findPasswordBtnRef = useRef(null);

  const [openFindId, setOpenFindId] = useState(initialTab === "id");
  const [openFindPass, setOpenFindPass] = useState(initialTab === "password");
  const [result, setResult] = useState({
    status: null,
    messages: [],
  });

  const handleFindId = (type) => {
    if (type === "success") {
      setResult({
        status: "success",
        messages: [
          "고객님의 아이디는 kim***입니다.",
          <>
            비밀번호를 찾으시려면{" "}
            <span
              className="text-brand-green font-bold cursor-pointer"
              onClick={findPasswordTap}
            >
              비밀번호 찾기
            </span>
            를 이용해주세요.
          </>,
        ],
      });
    } else {
      setResult({
        status: "fail",
        messages: [
          "고객님의 회원정보를 가진 아이디가 없습니다.",
          <>
            이용을 원하신다면 먼저{" "}
            <Link to="/join" className="font-bold text-brand-green">
              회원가입
            </Link>
            을 해주세요.
          </>,
        ],
      });
    }
  };

  const findIdTap = () => {
    setOpenFindId(true);
    setOpenFindPass(false);
    setResult({ status: null, messages: [] });
    setSearchParams({ tab: "id" });
  };

  const findPasswordTap = () => {
    setOpenFindId(false);
    setOpenFindPass(true);
    setResult({ status: null, messages: [] });
    setSearchParams({ tab: "password" });
  };

  // 아이디, 이름 input에 포커스 가게 하는 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (openFindId) {
        nameRef.current?.focus();
      } else {
        idRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [openFindId]);

  return (
    <Container>
      {/* 탭 영역 */}
      <div className="flex border-b -mt-5">
        {/* 아이디 찾기 */}
        <div
          className={`flex-1 text-center py-2 font-medium border-b-2 cursor-pointer ${
            openFindId
              ? "border-brand-green text-brand-green"
              : "border-transparent  text-brand-mediumgray"
          }`}
          onClick={findIdTap}
        >
          아이디 찾기
        </div>

        {/* 비밀번호 찾기 */}
        <div
          className={`flex-1 text-center py-2 font-medium border-b-2  cursor-pointer ${
            openFindPass
              ? "border-brand-green text-brand-green"
              : "border-transparent text-brand-mediumgray"
          }`}
          onClick={findPasswordTap}
        >
          비밀번호 찾기
        </div>
      </div>
      {/* 폼 영역 */}
      {!result.status && (
        <form className="border rounded-2xl p-6 mb-2">
          {/* 아이디 입력 영역 */}
          {openFindPass && (
            <div>
              <span className="flex justify-between">
                아이디를 입력해주세요.
              </span>
              <input
                ref={idRef}
                placeholder="아이디"
                className="w-full border rounded-xl my-5 py-2 px-4 text-base"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    nameRef.current?.focus();
                  }
                }}
              />
            </div>
          )}
          {/* 이름 입력 영역 */}
          <div>
            <span className="flex justify-between">이름을 입력해주세요.</span>
            <input
              ref={nameRef}
              placeholder="이름"
              className="w-full border rounded-xl my-5 py-2 px-4 text-base"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  phoneRef.current?.focus();
                }
              }}
            />
          </div>
          {/* 전화번호 입력 영역 */}
          <div>
            <span className="flex justify-between">
              전화번호를 입력해주세요.
            </span>
            <input
              ref={phoneRef}
              placeholder="전화번호"
              className="w-full border rounded-xl my-5 py-2 px-4 text-base"
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;

                e.preventDefault();

                if (openFindId) {
                  findIdBtnRef.current?.focus();
                } else {
                  findPasswordBtnRef.current?.focus();
                }
              }}
            />
          </div>
          {/* 버튼 영역 */}
          <div className="flex justify-center">
            {openFindId && (
              <Button
                type="button"
                ref={findIdBtnRef}
                variant="green"
                className="px-6"
                onClick={() => handleFindId("success")}
              >
                아이디 찾기
              </Button>
            )}
            {openFindPass && (
              <Button
                type="button"
                ref={findPasswordBtnRef}
                variant="green"
                className="px-6"
              >
                비밀번호 찾기
              </Button>
            )}
          </div>
        </form>
      )}
      {/* 결과 영역 */}
      <div>
        {result.status && (
          <div className="flex flex-col mt-6 border rounded-xl p-4">
            {result.messages.map((msg) => (
              <p>{msg}</p>
            ))}
            {result.status === "fail" && (
              <Button
                type="button"
                variant="green"
                className="px-6 mt-4 flex self-center"
                onClick={() => setResult({ status: null, messages: [] })}
              >
                다시 찾기
              </Button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default FindAccountPage;
