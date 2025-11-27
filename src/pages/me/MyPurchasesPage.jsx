import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Search, XCircle } from "lucide-react";

const MyPurchasesPage = () => {
  return (
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
  );
};

export default MyPurchasesPage;
