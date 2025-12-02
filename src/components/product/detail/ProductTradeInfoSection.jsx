const ProductTradeInfoSection = ({ detail }) => {
  return (
    <div className=" my-5 text-sm text-brand-darkgray ">
      <div className="flex justify-between mb-4">
        <span>거래방법</span>
        <div>
          {detail.direct && detail.delivery && (
            <span>직거래 가능 | 택배거래 가능</span>
          )}
          {!detail.direct && detail.delivery && <span>택배거래 가능</span>}
          {detail.direct && !detail.delivery && <span>직거래 가능</span>}
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <span>거래위치</span>
        <span>{detail.sellingArea}</span>
      </div>
      {/* 맵(2차-직거래만 노출) */}
      <div className="bg-gray-200 w-full h-70 flex items-center justify-center text-gray-600">
        맵
      </div>
    </div>
  );
};
export default ProductTradeInfoSection;
