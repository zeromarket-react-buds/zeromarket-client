import { Input } from "../ui/input";
import { Plus, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
const ChatInputBar = () => {
  return (
    <>
      <div className="flex gap-2 my-0 px-3 pt-7 py-7">
        <div className="py-1 text-brand-green">
          <Plus className="size-7 cursor-pointer" />
        </div>

        <Input></Input>

        <div className="py-1 text-brand-green">
          <SendHorizonal className="size-7 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default ChatInputBar;
