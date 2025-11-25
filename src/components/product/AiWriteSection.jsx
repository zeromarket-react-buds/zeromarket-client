import { useState } from "react";
import { GreenToggle } from "@/components/ui/greentoggle";

const AiWriteSection = () => {
  const [aiWrite, setAiWrite] = useState(false);
  return (
    <div>
      {/* AI로 작성하기 - 2,3차 개발*/}
      <div className="flex justify-between items-center p-4 py-5 my-5 bg-gray-200 rounded-xl">
        <span>
          <div className="font-medium text-lg">AI로 작성하기</div>
          <div className=" text-brand-darkgray text-sm">
            AI 작성 내용은 실제와 다를 수 있고, 수정 가능해요.
          </div>
        </span>

        <div className="flex items-center cursor-pointer  ">
          <GreenToggle
            checked={aiWrite}
            onChange={setAiWrite}
            className="size"
          />
        </div>
      </div>
    </div>
  );
};

export default AiWriteSection;
