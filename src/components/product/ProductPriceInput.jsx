import { useState } from "react";

const ProductPriceInput = ({ value, onChange }) => {
  const [price, setPrice] = useState(value || "");

  //화면 표시용 가격 포맷
  const formatNumber = (value) => {
    const numericValue = value.replace(/[^\d]/g, "");
    if (!numericValue) return "";
    return parseInt(numericValue, 10).toLocaleString();
  };

  const handlePrice = (e) => {
    const input = e.target.value;

    //ui용 포맷팅
    const formatted = formatNumber(input);
    setPrice(formatted);

    //서버용(콤마X)
    const numeric = input.replace(/[^\d]/g, "");
    onChange(numeric);
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
