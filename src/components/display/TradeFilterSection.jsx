import { GreenCheckBox } from "@/components/ui/greencheckbox";

const TradeFilterSection = ({ trade, setTrade }) => {
  const handleToggle = (type) => {
    setTrade((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  return (
    <div className="flex flex-col gap-4 my-0.5">
      <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
        거래방법
      </div>
      <div className="grid grid-cols-2 w-full pb-2 my-2">
        <GreenCheckBox
          label="택배거래"
          checked={trade.delivery}
          onChange={() => handleToggle("delivery")}
        />

        <GreenCheckBox
          label="직거래"
          checked={trade.direct}
          onChange={() => handleToggle("direct")}
        />
      </div>
    </div>
  );
};

export default TradeFilterSection;
