const DetailTitlePriceSection = ({ detail }) => {
  return (
    <div>
      {/* 상품명 */}
      <div className="text-2xl font-bold mb-2 ">{detail.productTitle}</div>
      {/* 가격 & 판매상태 */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-lg font-bold text-brand-green">
          {/* 판매중/예약중/거래완료 */}
          {detail.salesStatus?.description}
        </span>
        <span className="text-lg font-semibold">
          {detail.sellPrice?.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};
export default DetailTitlePriceSection;
