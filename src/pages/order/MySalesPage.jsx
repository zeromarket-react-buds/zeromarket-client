import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MySalesPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    goToTradeDetail();
  };

  const goToTradeDetail = () => {
    navigate("/:tradeid");
  };

  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div className="w-full">
        <form className="relative">
          <Input
            placeholder="상품명을 검색해주세요"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4">
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <span className="flex flex-row gap-2 py-3">
          <Filter /> 전체
        </span>
        <div>
          <div className="flex flex-row justify-between p-2 items-center">
            <span>절대시간</span>
            <XCircle className="w-4.5 h-4.5" />
          </div>
          <div
            className="flex flex-col gap-2 border border-brand-mediumgray rounded-2xl p-5"
            onClick={handleSubmit}
          >
            <div className="flex flex-row gap-10 items-center">
              <div className="bg-brand-mediumgray w-[100px] h-[100px] rounded-2xl" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="font-semibold">판매 게시글</div>
                <div className="font-semibold">가격</div>
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="text-brand-mediumgray">거래방법</div>
                  <Badge>거래완료</Badge>
                </div>
              </div>
            </div>
            <div className="text-center">상태바</div>
            <div className="text-center">상태바 설명</div>
            <Button variant="ivory">후기 보내기</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalesPage;
