import { Input } from "../ui/input";
import { Plus, SendHorizonal, Image, Camera, FileText } from "lucide-react";
import { useState } from "react";

const ChatInputBar = ({
  text,
  setText,
  sendMessage,
  connected,
  onOpenPhraseModal,
}) => {
  const [menuOpen, setMenuOpen] = useState(false); //+ 클릭시 액션메뉴 열림 상태
  return (
    <div className="border-t bg-white">
      {/* 입력 영역 */}
      <div className="flex gap-2 px-3 py-4">
        <div
          className="py-1 text-brand-green cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <Plus className="size-7" />
        </div>

        <Input
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지 보내기"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <div
          className={`py-1 cursor-pointer ${
            connected ? "text-brand-green" : "text-gray-300"
          }`}
          onClick={sendMessage}
        >
          <SendHorizonal className="size-7" />
        </div>
      </div>

      {/* + 클릭시 나오는 액션 메뉴 (입력창 아래) */}
      {menuOpen && (
        <div className="grid grid-cols-3 gap-6 px-6 pb-4 text-center text-sm">
          <button className="flex flex-col items-center gap-1">
            <Image size={22} />
            <span>앨범</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Camera size={22} />
            <span>카메라</span>
          </button>

          <button
            className="flex flex-col items-center gap-1 text-brand-green"
            onClick={() => {
              setMenuOpen(false); //메뉴 닫기
              onOpenPhraseModal(); // 자주 쓰는 문구 모달
            }}
          >
            <FileText size={22} />
            <span>자주 쓰는 문구</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInputBar;
