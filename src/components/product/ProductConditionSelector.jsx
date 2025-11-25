import { GreenRadio } from "../ui/greenradio";
import { useState } from "react";

const ProductConditionSelector = () => {
  const [condition, setCondition] = useState("used");
  return (
    <div className="mt-6">
      <p className="font-medium mb-2 text-lg">상품 상태</p>
      <div className="flex gap-4">
        <GreenRadio
          label="중고"
          value="used"
          checked={condition === "used"}
          onChange={setCondition}
          name="product-condition"
        />
        <GreenRadio
          label="새상품"
          value="new"
          checked={condition === "new"}
          onChange={setCondition}
          name="product-condition"
        />
      </div>
    </div>
  );
};
export default ProductConditionSelector;
