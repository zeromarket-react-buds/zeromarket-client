import { GreenRadio } from "../ui/greenradio";
import { useState } from "react";

const ProductConditionSelector = ({ value, onChange }) => {
  const [condition, setCondition] = useState(value || "USED");

  const options = [
    { label: "사용감있음", value: "USED" },
    { label: "개봉미사용", value: "OPENED_UNUSED" },
    { label: "미개봉", value: "UNOPENED" },
  ];

  return (
    <div className="mt-6">
      <p className="font-medium mb-2 text-lg">상품 상태</p>
      <div className="flex gap-4">
        {/* <GreenRadio
          label="중고"
          value="used"
          checked={condition === "used"}
          onChange={(c) => {
            setCondition(c);
            onChange(c);
          }}
          name="product-condition"
        />
        <GreenRadio
          label="새상품"
          value="new"
          checked={condition === "new"}
          onChange={setCondition}
          name="product-condition"
        /> */}
        {options.map((option) => (
          <GreenRadio
            key={option.value}
            label={option.label}
            value={option.value}
            checked={condition === option.value}
            onChange={(c) => {
              setCondition(c);
              onChange(c);
            }}
            name="product-condition"
          />
        ))}
      </div>
    </div>
  );
};
export default ProductConditionSelector;
