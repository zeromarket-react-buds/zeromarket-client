import { useState } from "react";

const ProductPriceInput = () => {
  const [price, setPrice] = useState("");

  const formatNumber = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return parseInt(numericValue, 10).toLocaleString();
  };

  const handlePrice = (e) => {
    const value = e.target.value;
    setPrice(formatNumber(value));
  };

  return (
    <div className="mt-5">
      <p className="font-medium mb-2 text-lg">판매가격</p>
      <input
        value={price}
        onChange={handlePrice}
        placeholder="₩ 판매가격"
        className="w-full border p-3 rounded-lg"
      />
    </div>
  );
};
export default ProductPriceInput;
