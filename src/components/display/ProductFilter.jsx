import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, XCircle } from "lucide-react";
import FilterSideBar from "./FilterSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const ProductFilter = ({ isOpen, onClose, keyword, setKeyword }) => {
  const [tempKeyword, setTempKeyword] = useState(keyword ?? "");
  const keywordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTempKeyword(keyword ?? "");
      setTimeout(() => keywordRef.current?.focus(), 0);
    }
  }, [isOpen, keyword]);

  const clearInput = () => {
    setTempKeyword("");
    setTimeout(() => keywordRef.current?.focus(), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const next = tempKeyword.trim(); // 모달창에서 임시 키워드 input값 넣은 부분
    if (!next) return;
    setKeyword(next); // submit 후 keyword 확정

    const params = new URLSearchParams();
    if (next) params.set("keyword", next);

    navigate(`/search?${params.toString()}`);
    onClose();
  };

  return (
    <div>
      {isOpen && (
        /* 모달 배경 */
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          {/* 모달창 */}
          <div
            className="bg-white p-6 rounded-xl z-50 w-[35em] max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-3 items-center border-b border-brand-mediumgray py-0.5">
              <div className="w-full text-base font-semibold">검색필터</div>
              <Button
                type="button"
                onClick={onClose}
                className="text-base pr-2"
              >
                <XCircle />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="relative w-full py-2 mb-2">
                <Input
                  placeholder="어떤 상품을 찾으시나요?"
                  value={tempKeyword}
                  onChange={(e) => setTempKeyword(e.target.value)}
                  ref={keywordRef}
                />
                {tempKeyword && (
                  <Button
                    type="button"
                    onClick={clearInput}
                    className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
              </div>
              <FilterSideBar />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
