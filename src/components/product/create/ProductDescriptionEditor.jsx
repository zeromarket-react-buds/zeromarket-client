import { useState, useRef } from "react";

const ProductDescriptionEditor = ({ value, onChange }) => {
  // const [description, setDescription] = useState(value || "");
  const inputRef = useRef(null);
  const maxLength = 2000;

  const handlePrice = (e) => {
    const input = e.target.value;
    const formatted = formatNumber(input);
    setDescription(formatted);
  };
  return (
    <div className="mt-6">
      {/* 상품 설명 */}
      <div className="flex justify-between mb-2">
        <span className="font-medium text-lg">상품 설명</span>
        <button className="text-sm font-light border px-2 py-1 rounded-lg">
          자주 쓰는 문구
        </button>
      </div>
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="w-full border p-3 rounded-lg h-32 text-sm overflow-x-auto"
          placeholder="상품명
사용(유효) 기간
거래 방법
실제 촬영한 사진과 함께 상세 정보를 입력해 주세요."
        />
        <div className="absolute bottom-2 right-3 py-2 text-right text-brand-mediumgray text-sm ">
          {value.length}/ {maxLength}
        </div>
      </div>
    </div>
  );
};
export default ProductDescriptionEditor;
