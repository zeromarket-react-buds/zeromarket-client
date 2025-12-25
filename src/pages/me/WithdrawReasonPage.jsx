import Container from "@/components/Container";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";

const REASONS = [
  { id: 2, label: "자주 사용하지 않음" },
  { id: 3, label: "거래가 불편함" },
  { id: 4, label: "배송/택배가 불만족스러움" },
  { id: 5, label: "콘텐츠/상품이 부족함" },
  { id: 6, label: "기타" },
];

export default function WithdrawReasonPage() {
  const navigate = useNavigate();
  const { withdraw } = useAuth();
  const [reasonId, setReasonId] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isOther = Number(reasonId) === 5;

  useEffect(() => {
    if (!isOther && detail) {
      setDetail("");
    }
  }, [isOther, detail]);

  const goBack = () => {
    navigate("/me/withdraw");
  };

  const handleSubmit = async () => {
    if (!reasonId) {
      window.alert("탈퇴 사유를 선택해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      await withdraw({
        withdrawalReasonId: Number(reasonId),
        withdrawalReasonDetail: detail.trim() || undefined,
      });
      window.alert("탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.");
      navigate("/");
    } catch (error) {
      console.error("탈퇴 요청 실패:", error);
      const serverMessage =
        error?.message ||
        "탈퇴 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      window.alert(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="pb-10">
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold mb-2">탈퇴 사유를 선택해주세요</h2>
          <p className="text-sm text-gray-700">
            선택하신 사유를 바탕으로 서비스 개선에 참고하며, 별도로 표시되지
            않습니다.
          </p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-gray-700">탈퇴 사유</label>
          <select
            value={reasonId}
            onChange={(e) => setReasonId(e.target.value)}
            className="w-full border rounded-lg px-3 py-3 bg-white"
            disabled={submitting}
          >
            <option value="">선택해주세요</option>
            {REASONS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="추가로 알려주실 내용이 있다면 적어주세요(선택)"
            className="w-full border rounded-lg px-3 py-3 min-h-[120px]"
            disabled={submitting || !isOther}
          />
        </div>

        <p className="text-sm text-gray-700">
          선택해주신 내용은 개선에 참고하며 반영됩니다. 탈퇴 이후에도 기존
          거래·평가 기록은 보관될 수 있습니다.
        </p>
      </section>

      <div className="bg-white fixed flex flex-col items-center left-0 right-0 bottom-0 px-4 p-3 space-y-3">
        <button
          onClick={handleSubmit}
          className="w-[600px] bg-brand-green text-white font-semibold py-3 rounded-lg disabled:opacity-60"
          disabled={submitting}
        >
          탈퇴 요청하기
        </button>
        <button
          onClick={goBack}
          className="w-[600px] border border-gray-300 text-gray-800 font-semibold py-3 rounded-lg bg-gray-100"
          disabled={submitting}
        >
          이전으로
        </button>
      </div>
    </Container>
  );
}
