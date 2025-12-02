import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ProductTitleInput = ({ value, onChange }) => {
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  const clearInput = () => {
    setTitle("");
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
          onChange={(e) => onChange(e.target.value)}
          placeholder="상품명을 입력해 주세요."
          className={cn("w-full border p-3 rounded-lg")}
        />
        {title && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-600 rounded-full p- w-5 h-5 flex items-center justify-center"
          >
            {/* <X className="stroke-2 w-5 h-5" /> */}
            <Button type="button" className="text-base pr-2">
              <CircleX />
            </Button>
          </button>
        )}
      </div>
    </div>
  );
};
export default ProductTitleInput;
