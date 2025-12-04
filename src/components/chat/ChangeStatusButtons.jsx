import { Button } from "@/components/ui/button";

const ChangeStatusButtons = () => {
  return (
    <div className="flex gap-2  my-0 pt-3 py-4">
      <Button className="flex-1 border font-bold bg-brand-green border-brand-green text-brand-ivory py-2">
        예약중으로
      </Button>
      <Button className="flex-1 border font-bold bg-brand-green border-brand-green text-brand-ivory py-2">
        거래완료
      </Button>
    </div>
  );
};

export default ChangeStatusButtons;
