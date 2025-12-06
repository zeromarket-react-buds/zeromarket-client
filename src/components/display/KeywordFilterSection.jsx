import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";

const KeywordFilterSection = ({
  tempKeyword,
  setTempKeyword,
  keywordRef,
  clearKeyword,
  categoryFocusRef,
}) => {
  return (
    <div className="relative w-full pt-2 pb-2 my-2">
      <Input
        placeholder="어떤 상품을 찾으시나요?"
        className="font-normal"
        value={tempKeyword}
        onChange={(e) => setTempKeyword(e.target.value)}
        ref={keywordRef}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            keywordRef.current?.focus();
            categoryFocusRef.current?.focus();
          }
        }}
      />
      {tempKeyword && (
        <Button
          type="button"
          onClick={clearKeyword}
          className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4"
        >
          <XCircle />
        </Button>
      )}
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
    </div>
  );
};

export default KeywordFilterSection;
