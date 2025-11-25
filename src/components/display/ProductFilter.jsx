import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, XCircle } from "lucide-react";
import FilterSideBar from "./FilterSidebar";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const ProductFilter = ({ isOpen, onClose, keyword, setKeyword }) => {
  const keywordRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && keywordRef.current) {
      keywordRef.current.focus();
    }
  }, [isOpen]);

  //input창 클리어
  const clearInput = (e) => {
    e.preventDefault(); // submit 방지
    e.stopPropagation(); // 이벤트버블링 방지
    setKeyword("");
    requestAnimationFrame(() => {
      keywordRef.current.focus();
    });
  };

  // 필터 검색 form submit 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("keyword", keyword.trim());

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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  ref={keywordRef}
                />
                {keyword && (
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
