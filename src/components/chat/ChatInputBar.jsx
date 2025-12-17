import { Input } from "../ui/input";
import { Plus, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
const ChatInputBar = ({ text, setText, sendMessage, connected }) => {
  return (
    <>
      <div className="flex gap-2 my-0 px-3 pt-7 py-7">
        <div className="py-1 text-brand-green">
          <Plus className="size-7 cursor-pointer" />
        </div>

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지 입력..."
        ></Input>

        <input style={{ flex: 1 }} />

        <div
          className="py-1 text-brand-green"
          onClick={sendMessage}
          disabled={!connected}
        >
          <SendHorizonal className="size-7 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default ChatInputBar;
