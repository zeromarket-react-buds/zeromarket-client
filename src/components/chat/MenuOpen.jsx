import { Button } from "@/components/ui/button";
import { useCallback, useLayoutEffect, useState } from "react";

const MENU_W = 144;
const MENU_H = 96;

const MenuOpen = ({
  onCloseMenu,
  onOpenReportModal,
  onOpenBlockModal,
  anchorEl,
  isMe,
}) => {
  if (isMe) return null;

  const [pos, setPos] = useState({
    top: 80,
    left: window.innerWidth - MENU_W - 16,
  });

  const updatePos = useCallback(() => {
    const margin = 8;

    if (!anchorEl) return;

    const rect = anchorEl.getBoundingClientRect(); // 현재 화면에서의 (...)버튼 위치/크기를 구함. 현재 보이는 화면(뷰포트) 기준 좌표
    let top = rect.bottom + margin; // 메뉴를 버튼 바로 아래에 띄우는 계산
    let left = rect.right - MENU_W; // 메뉴의 오른쪽 끝을 버튼의 오른쪽 끝에 맞추는 계산
    // rect에는 top, bottom, left, right 값이 들어가있음.

    // 화면 왼쪽 밖이나 오른쪽 밖으로 나가지 않게 강제고정
    if (left < 8) left = 8;
    if (left > window.innerWidth - MENU_W - 8)
      // window.innerWidth은 현재 브라우저 화면의 전체 가로 폭
      left = window.innerWidth - MENU_W - 8;

    // 메뉴 아래 공간 없으면 위로
    const overflowBottom = top + MENU_H > window.innerHeight - 8;
    if (overflowBottom) {
      top = rect.top - margin - MENU_H;
      if (top < 8) top = 8;
    }

    setPos({ top, left });
  }, [anchorEl]);

  useLayoutEffect(() => {
    // 위치 계산은 DOM의 실제 위치를 측정. useLayoutEffect는 화면이 그려지기 직전에 실행
    updatePos(); // 컴포넌트가 처음 렌더링될 때 현재 버튼 위치를 기준으로 메뉴 위치를 바로 계산해 세팅

    const onResize = () => updatePos(); // 위치 변하면 재계산
    const onScroll = () => updatePos(); // 스크롤로 위치 변하면 재계산

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true); // true: 캡처링으로 내부 스크롤까지 감지

    return () => {
      // cleanup 함수
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [updatePos]);

  const handleReport = async () => {
    onCloseMenu();
    await onOpenReportModal();
  };

  const handleBlock = async () => {
    onCloseMenu();
    await onOpenBlockModal();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onCloseMenu} />

      <div
        className="fixed bg-white rounded-xl shadow-xl border w-36 p-2 z-50"
        style={{ top: pos.top, left: pos.left }}
      >
        <Button
          className="w-full text-black p-2 hover:bg-gray-100"
          onClick={handleReport}
        >
          신고하기
        </Button>
        <Button
          className="w-full text-black p-2 hover:bg-gray-100"
          onClick={handleBlock}
        >
          차단하기
        </Button>
      </div>
    </>
  );
};

export default MenuOpen;
