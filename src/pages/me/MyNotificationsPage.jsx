import { useState } from "react";
import Container from "@/components/Container";
import { GreenToggle } from "@/components/ui/greentoggle";

const SectionLabel = ({ children }) => (
  <p className="mb-2 font-semibold">{children}</p>
);

const Box = ({ children }) => (
  <div className="w-full border rounded-2xl px-4 py-4 mb-6">{children}</div>
);

const MyNotificationsPage = () => {
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [chatNotify, setChatNotify] = useState(false);
  const [keywordNotify, setKeywordNotify] = useState(false);
  const [noticeNotify, setNoticeNotify] = useState(false);
  const [eventNotify, setEventNotify] = useState(false);

  return (
    <Container>
      {/* 방해 금지 설정 */}
      <Box>
        <div className="flex items-center justify-between">
          <p>방해 금지 시간 설정</p>
          <GreenToggle checked={doNotDisturb} onChange={setDoNotDisturb} />
        </div>
      </Box>

      {/* 채팅 */}
      <SectionLabel>채팅</SectionLabel>
      <Box>
        <div className="flex items-center justify-between">
          <p>채팅 알림</p>
          <GreenToggle checked={chatNotify} onChange={setChatNotify} />
        </div>
      </Box>

      {/* 키워드 */}
      <SectionLabel>키워드</SectionLabel>
      <Box>
        <div className="flex items-center justify-between mb-2">
          <p>키워드 알림</p>
          <GreenToggle checked={keywordNotify} onChange={setKeywordNotify} />
        </div>
        <p>키워드 알림 설정</p>
      </Box>

      {/* 시스템 알림 */}
      <SectionLabel>시스템 알림</SectionLabel>
      <Box>
        <div className="flex items-center justify-between mb-4">
          <p>공지 알림</p>
          <GreenToggle checked={noticeNotify} onChange={setNoticeNotify} />
        </div>

        <div className="flex items-center justify-between">
          <p>이벤트 알림</p>
          <GreenToggle checked={eventNotify} onChange={setEventNotify} />
        </div>
      </Box>
    </Container>
  );
};

export default MyNotificationsPage;
