const ProductDescriptionEditor = ({ value, onChange, onOpenPhraseModal }) => {
  const maxLength = 2000;

  const handleChange = (e) => {
    let text = e.target.value;

    if (text.length > maxLength) {
      text = text.substring(0, maxLength);
    }

    onChange(text);
  };

  // const consoleCheck = () => {
  //   console.log("자주 쓰는 문구 클릭");
  // };

  return (
    <div className="mt-6">
      {/* 상품 설명 */}
      <div className="flex justify-between mb-2">
        <span className="font-medium text-lg">상품 설명</span>

        {/* 자주 쓰는 문구 버튼 */}
        <button
          className="text-sm font- border px-2 py-1 rounded-lg cursor-pointer"
          onClick={onOpenPhraseModal}
        >
          자주 쓰는 문구
        </button>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          className="w-full border p-3 rounded-lg h-32 max-h-100 text-sm overflow-x-auto"
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
