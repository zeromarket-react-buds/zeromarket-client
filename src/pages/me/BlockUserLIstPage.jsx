import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const BlockUserLIstPage = () => {
  return (
    <Container className="-mt-5">
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-brand-green font-semibold pl-5">사용자</span>
          님은 현재
          <span className="pl-4 pr-1 text-brand-green text-2xl font-semibold">
            3
          </span>
          명을 차단 중입니다.
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between border border-brand-mediumgray rounded-2xl items-center px-6 py-2">
            <div className="flex flex-row gap-10 items-center">
              <User className="w-10 h-10 rounded-full p-1 bg-brand-green text-brand-ivory" />

              <div className="text-lg">차단한 유저명</div>
            </div>
            <Button
              variant="green"
              type="button"
              className="rounded-2xl text-end"
            >
              차단해제
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default BlockUserLIstPage;
