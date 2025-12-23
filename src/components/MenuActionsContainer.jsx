import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "@/hooks/AuthContext";

import MenuOpen from "@/components/chat/MenuOpen";
import ReportModal from "@/components/report/ReportModal";
import BlockModal from "@/components/block/BlockModal";

import { createReportApi } from "@/common/api/report.api";
import { createBlockApi } from "@/common/api/block.api";

export default function MenuActionsContainer({
  menuOpen,
  setMenuOpen,
  anchorEl,

  // 신고/차단 대상(상대방 memberId)
  targetMemberId,

  // 신고 모달 기준. MEMBER / PRODUCT
  reportTargetType = "MEMBER",

  // 차단 후 즉시 반영이 필요한 화면만 넘기기 (없으면 생략 가능)
  onAfterBlock,
}) {
  const navigate = useNavigate();
  const { alert, confirm } = useModal();
  const { user, isAuthenticated } = useAuth();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const isMe =
    isAuthenticated && String(user?.memberId) === String(targetMemberId);

  useEffect(() => {
    const onOpen = (e) => {
      if (isMe) return;
      setAnchorEl(e.detail?.anchorEl ?? null);
      setMenuOpen(true);
    };

    window.addEventListener("seller-menu-open", onOpen);
    return () => window.removeEventListener("seller-menu-open", onOpen);
  }, [setMenuOpen, isMe]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 로그인 한사람인지 아닌지 검증
  const ensureAuthOrGoLogin = async (message) => {
    if (isAuthenticated) return true; // 로그인 한 사람은 여기서 리턴. 통과

    const goLogin = await confirm({ description: message }); // 로그인 안한 사람은 confirm창
    if (goLogin) navigate("/login");

    return false;
  };

  // 신고 모달 열기
  const openReportModal = async () => {
    const ok = await ensureAuthOrGoLogin(
      "신고 기능은 로그인 후 이용 가능합니다.\n로그인 화면으로 이동하시겠습니까?"
    );
    if (!ok) return;

    if (String(user?.memberId) === String(targetMemberId)) {
      await alert({ description: "본인은 신고할 수 없습니다." });
      setMenuOpen(false);
      return;
    }

    if (!targetMemberId) {
      await alert({ description: "신고 대상을 찾을 수 없습니다." });
      return;
    }

    setIsReportModalOpen(true);
  };

  // 차단 모달 열기
  const openBlockModal = async () => {
    const ok = await ensureAuthOrGoLogin(
      "차단 기능은 로그인 후 이용 가능합니다.\n로그인 화면으로 이동하시겠습니까?"
    );
    if (!ok) return;

    if (String(user?.memberId) === String(targetMemberId)) {
      await alert({ description: "본인은 차단할 수 없습니다." });
      setMenuOpen(false);
      return;
    }

    if (!targetMemberId) {
      await alert({ description: "차단 대상을 찾을 수 없습니다." });
      return;
    }

    setIsBlockModalOpen(true);
  };

  // 신고 제출
  const handleSubmitReport = async ({ reasonId, reasonText }) => {
    // if (!detail) return;

    const payload = {
      reasonId,
      targetType: reportTargetType,
      targetId: Number(targetMemberId),
      reasonText: reasonText || null,
    };

    try {
      const result = await createReportApi(payload);
      await alert({
        description: result?.message || "신고가 접수되었습니다.",
      });
      setIsReportModalOpen(false);
    } catch (error) {
      console.error("신고 제출 실패", error);
      await alert({ description: "신고 처리 중 문제가 발생했습니다." });
    }
  };

  // 차단 제출. BlockModal이 onApply({ blockedUserId }) 형태로 줄 수도 있어서 안전하게 받기
  const handleSubmitBlock = async ({ blockedUserId } = {}) => {
    const id = Number(blockedUserId ?? targetMemberId);
    if (!id) {
      await alert({ description: "차단 대상을 찾을 수 없습니다." });
      return;
    }

    try {
      const result = await createBlockApi({ blockedUserId: id });

      await onAfterBlock?.(); // 필요할 때만. 아니면 x

      await alert({ description: result?.message });
      setIsBlockModalOpen(false);
    } catch (error) {
      console.error("차단 실패", error);
      await alert({ description: "차단 처리 중 문제가 발생했습니다." });
    }
  };

  return (
    <>
      {menuOpen && (
        // 신고/차단하기 선택 모달
        <MenuOpen
          onCloseMenu={closeMenu}
          onOpenReportModal={openReportModal}
          onOpenBlockModal={openBlockModal}
          anchorEl={anchorEl}
          isMe={isMe}
        />
      )}

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onclose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
        targetType={reportTargetType}
      />

      {/* 차단 모달 */}
      {isBlockModalOpen && (
        <BlockModal
          sellerId={String(targetMemberId)}
          onClose={() => setIsBlockModalOpen(false)}
          onApply={handleSubmitBlock}
        />
      )}
    </>
  );
}
