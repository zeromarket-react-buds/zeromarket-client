import { GreenToggle } from "@/components/ui/greentoggle";

const AiWriteSection = ({ value, onChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center p-4 py-5 my-5 bg-gray-200 rounded-xl">
        <span>
          <div className="font-medium text-lg">AI로 작성하기</div>
          <div className=" text-brand-darkgray text-sm">
            AI 작성 내용은 실제와 다를 수 있고, 수정 가능해요.
          </div>
        </span>

        <div className="flex items-center cursor-pointer">
          <GreenToggle checked={value} onChange={onChange} className="size" />
        </div>
      </div>
    </div>
  );
};

export default AiWriteSection;
