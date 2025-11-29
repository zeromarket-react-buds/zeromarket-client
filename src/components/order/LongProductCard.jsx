import { Badge } from "@/components/ui/badge";

const LongProductCard = () => {
  return (
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
  );
};

export default LongProductCard;
