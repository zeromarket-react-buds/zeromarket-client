import { GreenRadio } from "../ui/greenradio";
import { Button } from "../ui/button";
import { X, Plus } from "lucide-react";
import { useState } from "react";

const TradeMethodSelector = ({ value, onChange }) => {
  const [tradeMethod, setTradeMethod] = useState(value || "delivery");

  const handleChange = (method) => {
    setTradeMethod(method);
    onChange(method);
  };
  return (
    <div className="mt-8">
      {/* 거래 방법 */}
      <p className="font-bold mb-2 border-b py-1 text-lg">거래 방법</p>
      <div className=" mt-3">
        <GreenRadio
          label="택배거래"
          value="delivery"
          checked={tradeMethod === "delivery"}
          onChange={() => handleChange("delivery")}
          name="trade-method"
        />
        <p className="text-gray-400 text-sm mt-1 mb-5">배송비 포함(무료배송)</p>

        <GreenRadio
          label="직거래"
          value="direct"
          checked={tradeMethod === "direct"}
          onChange={() => handleChange("direct")}
          name="trade-method"
        />
      </div>

      {/* 직거래 선택시 뜨는 장소 */}
      {tradeMethod === "direct" && (
        <div className="flex gap-2 flex-wrap mt-2 ">
          <Button className="bg-gray-200 text-black rounded-3xl">
            <span>역삼2동</span>
            <span>
              <X className="text-brand-darkgray" />
            </span>
          </Button>
          <Button className="bg-gray-200 text-black rounded-3xl">
            <span>방화제1동</span>
            <span>
              <X className="text-brand-darkgray" />
            </span>
          </Button>
          <Button className="bg-white border-2 border-gray-200 text-black rounded-3xl">
            <span>
              <Plus className="text-brand-darkgray" />
            </span>
            <span>위치 설정</span>
          </Button>
        </div>
      )}
    </div>
  );
};
export default TradeMethodSelector;
