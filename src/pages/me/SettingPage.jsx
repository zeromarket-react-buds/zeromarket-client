import { useMemo, useState } from "react";
import Container from "@/components/Container";
import { GreenToggle } from "@/components/ui/greentoggle";
import { useNotification } from "@/hooks/NotificationContext";
import { useNavigate } from "react-router-dom";

const SectionLabel = ({ children }) => (
  <p className="mb-2 font-semibold">{children}</p>
);

const Box = ({ children }) => (
  <div className="w-full border rounded-2xl px-4 py-4 mb-6">{children}</div>
);

function HelpButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-2 text-sm text-gray-500 underline hover:text-gray-700"
    >
      설정 방법
    </button>
  );
}

function PermissionHelpSheet({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* dim */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* sheet */}
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">브라우저 알림 권한 설정</p>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            닫기
          </button>
        </div>

        <div className="mt-3 text-sm text-gray-700 space-y-3">
          <div>
            <p className="font-semibold">Chrome / Edge</p>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>주소창 왼쪽 🔒 아이콘 클릭</li>
              <li>"사이트 설정" 클릭</li>
              <li>"알림"을 "허용"으로 변경</li>
              <li>페이지 새로고침</li>
            </ol>
          </div>

          <div>
            <p className="font-semibold">Safari (macOS)</p>
            <ol className="list-decimal ml-5 mt-1 space-y-1">
              <li>Safari → 설정</li>
              <li>웹 사이트 → 알림</li>
              <li>해당 사이트 "허용"</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500">
            * 권한이 "차단(denied)" 상태면 앱에서 다시 권한 팝업을 띄울 수 없고,
            브라우저 설정에서 직접 변경해야 합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-gray-900 py-3 text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

const SettingPage = () => {
  const { settings, setSetting, setSettingWithPermission } = useNotification();
  const [helpOpen, setHelpOpen] = useState(false);
  const navigate = useNavigate();

  // permission 상태는 브라우저 전역
  const permission = useMemo(() => {
    if (typeof window === "undefined") return "default";
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission; // "default" | "granted" | "denied"
  }, []);

  const denied = permission === "denied";

  return (
    <Container>
      {/* 방해 금지 */}
      <Box>
        <div className="flex items-center justify-between">
          <p>방해 금지 시간 설정</p>
          <GreenToggle
            checked={settings.doNotDisturb}
            onChange={(next) => setSetting("doNotDisturb", next)}
          />
        </div>
      </Box>

      {/* 채팅 */}
      <SectionLabel>채팅</SectionLabel>
      <Box>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p>채팅 알림</p>
            {denied && <HelpButton onClick={() => setHelpOpen(true)} />}
          </div>

          <GreenToggle
            checked={settings.chatNotify}
            onChange={async (next) => {
              const ok = await setSettingWithPermission("chatNotify", next);
              if (!ok && denied) setHelpOpen(true); // ✅ 거절 상태면 바로 안내 열어주기
            }}
          />
        </div>

        {denied && (
          <p className="mt-2 text-xs text-red-500">
            브라우저 알림 권한이 차단되어 있어요. 설정에서 허용으로
            변경해주세요.
          </p>
        )}
      </Box>

      {/* 키워드 */}
      <SectionLabel>키워드</SectionLabel>
      <Box>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <p>키워드 알림</p>
            {denied && <HelpButton onClick={() => setHelpOpen(true)} />}
          </div>

          <GreenToggle
            checked={settings.keywordNotify}
            onChange={async (next) => {
              const ok = await setSettingWithPermission("keywordNotify", next);
              if (!ok && denied) setHelpOpen(true);
            }}
          />
        </div>
        <p className="cursor-pointer" onClick={() => navigate("/me/keywords")}>
          키워드 알림 설정
        </p>
      </Box>

      {/* 시스템 알림 */}
      <SectionLabel>시스템 알림</SectionLabel>
      <Box>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <p>공지 알림</p>
            {denied && <HelpButton onClick={() => setHelpOpen(true)} />}
          </div>

          <GreenToggle
            checked={settings.noticeNotify}
            onChange={async (next) => {
              const ok = await setSettingWithPermission("noticeNotify", next);
              if (!ok && denied) setHelpOpen(true);
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p>이벤트 알림</p>
            {denied && <HelpButton onClick={() => setHelpOpen(true)} />}
          </div>

          <GreenToggle
            checked={settings.eventNotify}
            onChange={async (next) => {
              const ok = await setSettingWithPermission("eventNotify", next);
              if (!ok && denied) setHelpOpen(true);
            }}
          />
        </div>
      </Box>

      <PermissionHelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} />
    </Container>
  );
};

export default SettingPage;
