import { useRef } from "react";
import { Input } from "@/components/ui/input";

const PriceFilterSection = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onEnterToArea,
}) => {
  const minPriceRef = useRef(null);
  const maxPriceRef = useRef(null);

  const handleMinPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMinPrice(numeric === "" ? "" : Number(numeric)); // 입력받은 값을 숫자로
  };

  const handleMaxPrice = (e) => {
    const numeric = e.target.value.replace(/[^0-9]/g, "");
    setMaxPrice(numeric === "" ? "" : Number(numeric));
  };

  return (
    <div className="flex flex-col gap-4 my-0.5">
      <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
        가격
      </div>
      <div className="flex w-full items-center gap-2">
        <Input
          onChange={handleMinPrice}
          inputMode="numeric"
          value={minPrice !== "" ? minPrice?.toLocaleString() : ""}
          className="font-normal"
          placeholder="최소 가격"
          ref={minPriceRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              maxPriceRef.current?.focus();
            }
          }}
        />
        <span>-</span>
        <Input
          onChange={handleMaxPrice}
          inputMode="numeric"
          value={maxPrice !== "" ? maxPrice?.toLocaleString() : ""}
          className="font-normal"
          placeholder="최대 가격"
          ref={maxPriceRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (onEnterToArea) {
                onEnterToArea();
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default PriceFilterSection;
