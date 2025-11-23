import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";

const MyPurchasesPage = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <button>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">나의 구매내역</h1>
        <div className="justify-self-end w-9" />
      </header>
      <main className="flex flex-col p-2 gap-4 max-w-full">
        <div className="relative w-full">
          <form>
            <Input
              placeholder="상품명을 검색해주세요"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-mediumgray" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default MyPurchasesPage;
