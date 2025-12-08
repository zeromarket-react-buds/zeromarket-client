import { CircleX } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const ProductTitleInput = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const clearInput = () => {
    onChange("");
    requestAnimationFrame(() => {
      inputRef.current.focus();
    });
  };
  return (
    <div className="mt-5">
      <p className="font-medium mb-2 text-lg">상품명</p>
      <div className="relative">
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          placeholder="상품명을 입력해 주세요."
          className={cn("w-full border p-3 rounded-lg")}
        />
        {value && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 text-brand-darkgray rounded-full p- w-5 h-5 flex items-center justify-center"
          >
            <CircleX size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductTitleInput;
