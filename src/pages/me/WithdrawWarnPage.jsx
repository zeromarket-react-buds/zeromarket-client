import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";

export default function WithdrawWarnPage() {
  const navigate = useNavigate();

  const goNext = () => navigate("/me/withdraw/reason");
  const goBack = () => navigate("/me");

  return (
    <Container className="pb-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold mb-2">
            탈퇴 전 꼭 확인해주세요
          </h2>
          <p className="text-sm text-gray-700">
            탈퇴 후에는 아래 내용이 즉시 적용되며 복구가 어려워요.
          </p>
        </div>

        <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
          <li>모든 게시글과 채팅방이 삭제됩니다.</li>
          <li>모든 활동 정보가 삭제됩니다.</li>
          <li>진행 중인 거래나 포인트는 복구되지 않습니다.</li>
          <li>재가입하셔도 기존 데이터는 복구되지 않습니다.</li>
          <li>다른 사용자에게 보낸 채팅/후기는 계속 노출될 수 있습니다.</li>
          <li>탈퇴 후 7일간 재가입이 제한됩니다.</li>
        </ul>

        <p className="text-sm text-red-600 font-semibold">
          탈퇴를 진행하면 즉시 적용되며, 소셜 계정의 경우, 7일간 재가입이
          제한됩니다.
        </p>
      </section>

      <div className="bg-white flex flex-col items-center fixed left-0 right-0 bottom-0 px-4 p-3 space-y-3">
        <button
          onClick={goNext}
          className="w-[600px] bg-brand-green text-white font-semibold py-3 rounded-lg"
        >
          계속 진행
        </button>
        <button
          onClick={goBack}
          className="w-[600px] border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg bg-gray-100"
        >
          돌아가기
        </button>
      </div>
    </Container>
  );
}
