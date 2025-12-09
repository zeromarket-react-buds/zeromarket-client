import { useState, useEffect } from "react";
import { GreenRadio } from "../ui/greenradio";
import { CircleX } from "lucide-react";
import { reportReasonApi } from "@/common/api/report.api";

const ReportModal = ({ isOpen, onclose, onSubmit, targetType }) => {
  const [mode, setMode] = useState("DEFAULT");
  const [etcText, setEtcText] = useState("");
  const [reasons, setReasons] = useState([]);
  const [selectedReasonId, setSelectedReasonId] = useState(null);

  const ETC_REASON_ID = targetType === "PRODUCT" ? 12 : 7;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    if (isOpen) {
      setMode("DEFAULT");
      setEtcText("");
      setSelectedReasonId(null);
    }
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const reasonList = await reportReasonApi(targetType);
        setReasons(reasonList);
      } catch (error) {
        console.error("신고 사유 불러오기 실패:", error);
      }
    };
    load();
  }, [isOpen, targetType]);

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (mode === "ETC" && etcText.trim()) {
      const confirmExit = window.confirm(
        "이 창을 나가면 입력하신 내용이 저장되지 않습니다.\n닫으시겠습니까?"
      );
      if (!confirmExit) return;
    }
    onclose();
    setMode("DEFAULT");
    setEtcText("");
    setSelectedReasonId(null);
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const reasonClick = (reasonId, label) => {
    if (reasonId === ETC_REASON_ID) {
      setMode("ETC");
      return;
    }
    setSelectedReasonId(reasonId);
    const ok = window.confirm(
      `신고 사유로 "${label}" 를 선택하셨습니다.\n제출하시겠습니까?`
    );
    if (!ok) return;

    onSubmit({ reasonId, reasonText: null });
    console.log("신고접수:", label);
    onclose();
    setMode("DEFAULT");
    setEtcText("");
    setSelectedReasonId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white rounded-2xl p-3 w-sm shadow-xl"
        onClick={handleContentClick}
      >
        <div className="mb-2">
          <div className="flex justify-end mb-3">
            <CircleX
              // size={25}
              className="cursor-pointer bg-brand-green rounded-full text-white"
              onClick={onclose}
            />
          </div>
          <div className="text-brand-green text-2xl  px-5 font-semibold">
            해당 게시글이 문제가 있나요?
          </div>
        </div>
        {/* 신고사유 선택화면 */}
        {mode === "DEFAULT" && (
          <div className="px-5 mb-8">
            <div className="text-brand-darkgray mb-6">
              해당하는 부분을 클릭해주세요
            </div>
            {reasons.map((r) => (
              <div
                key={r.reasonId}
                className="flex mb-5 cursor-pointer"
                onClick={() => reasonClick(r.reasonId, r.reasonDescription)}
              >
                <GreenRadio
                  checked={selectedReasonId === r.reasonId} // 선택된 이유 ID가 일치하면 체크
                  onChange={() => setSelectedReasonId(r.reasonId)} // 선택된 이유 업데이트
                  name="reportReason"
                />
                {r.reasonDescription}
              </div>
            ))}
          </div>
        )}

        {/* 기타사유 입력화면 */}
        {mode === "ETC" && (
          <div className="px-5 mb-8">
            <div className="text-brand-darkgray mb-5">
              기타를 선택하셨습니다.
            </div>
            <textarea
              placeholder="신고 사유를 입력해주세요."
              className="border border-brand-green rounded-lg w-full h-60 p-3 text-sm overflow-x-auto"
              value={etcText}
              onChange={(e) => setEtcText(e.target.value)}
            />
            <button
              className="w-full bg-brand-green text-white p-3 text-lg rounded-lg mt-3"
              onClick={() => {
                const text = etcText.trim();
                if (!text) return alert("사유를 입력해주세요.");
                onSubmit({
                  reasonId: ETC_REASON_ID,
                  reasonText: text,
                });
              }}
            >
              제출하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
