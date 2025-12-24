import { useState, useEffect } from "react";
import { GreenRadio } from "../ui/greenradio";
import { X } from "lucide-react";
import { reportReasonApi } from "@/common/api/report.api";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/useModal";

const ReportModal = ({ isOpen, onclose, onSubmit, targetType }) => {
  const [mode, setMode] = useState("DEFAULT");
  const [etcText, setEtcText] = useState("");
  const [reasons, setReasons] = useState([]);
  const [selectedReasonId, setSelectedReasonId] = useState(null);
  const { alert, confirm } = useModal();
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

  const handleCloseAttempt = async () => {
    if (mode === "ETC" && etcText.trim()) {
      const confirmExit = await confirm({
        description:
          "이 창을 나가면 입력하신 내용이 저장되지 않습니다.\n닫으시겠습니까?",
        confirmText: "창 나가기",
        variant: "destructive",
      });
      if (!confirmExit) return;
    }
    onclose();
    resetState();
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  const reasonClick = async (reasonId, label) => {
    if (reasonId === ETC_REASON_ID) {
      setMode("ETC");
      return;
    }
    setSelectedReasonId(reasonId);
    const ok = await confirm({
      description: `신고 사유로 "${label}" 를 선택하셨습니다.  신고를 접수하시겠습니까?`,
    });
    if (!ok) return;

    await onSubmit({ reasonId, reasonText: null });
    console.log("신고접수:", label);
    onclose();
    resetState();
  };
  const resetState = () => {
    setMode("DEFAULT");
    setEtcText("");
    setSelectedReasonId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center"
      onClick={handleCloseAttempt}
    >
      <div
        className="bg-white rounded-2xl p-3 w-sm shadow-xl select-none"
        onClick={handleContentClick}
      >
        <div className="mb-2">
          <div className="flex justify-end mb-3 ">
            <div
              className="rounded-full bg-brand-green p-0.5 text-white cursor-pointer "
              onClick={handleCloseAttempt}
            >
              <X className="stroke-3 size-5 " />
            </div>
          </div>
          <div className="text-brand-green text-2xl  px-5 font-semibold">
            해당 게시글이 문제가 있나요?
          </div>
        </div>
        {/* 신고사유 선택화면 */}
        {mode === "DEFAULT" && (
          <div className="px-5 mb-8">
            <div className="text-brand-darkgray mb-6 ">
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
              maxLength={200}
            />
            <div className="text-xs text-brand-mediumgray text-right px-2">
              {etcText.length} / 200
            </div>

            <button
              className="w-full bg-brand-green text-white p-3 text-lg rounded-lg mt-2"
              onClick={async () => {
                const text = etcText.trim();
                if (!text) {
                  await alert({ description: "사유를 입력해주세요." });
                  return;
                }
                await onSubmit({
                  reasonId: ETC_REASON_ID,
                  reasonText: text,
                });
                onclose();
                resetState();
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
