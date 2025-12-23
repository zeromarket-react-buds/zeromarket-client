import { GreenRadio } from "@/components/ui/greenradio";
import { useEffect, useState } from "react";

const ProductConditionSelector = ({ value, onChange }) => {
  // const [condition, setCondition] = useState(value || "USED");
  console.log("ProductConditionSelector value:", value);
  const options = [
    { label: "사용감있음", value: "USED" },
    { label: "개봉미사용", value: "OPENED_UNUSED" },
    { label: "미개봉", value: "UNOPENED" },
  ];

  return (
    <div className="mt-6">
      <p className="font-medium mb-2 text-lg">상품 상태</p>
      <div className="flex gap-4">
        {options.map((option) => (
          <GreenRadio
            key={option.value}
            label={option.label}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            name="product-condition"
          />
        ))}
      </div>
    </div>
  );
};
export default ProductConditionSelector;
