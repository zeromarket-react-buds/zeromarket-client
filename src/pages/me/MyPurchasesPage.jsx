import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, XCircle } from "lucide-react";

const MyPurchasesPage = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">나의 구매내역</h1>
        <div className="justify-self-end w-9" />
      </div>
      <div className="flex flex-col p-2 gap-4 max-w-full">
        <div className="relative w-full">
          <form>
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
        </div>
      </div>
    </div>
  );
};

export default MyPurchasesPage;
