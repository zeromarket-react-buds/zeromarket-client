const DetailEcoScoreSection = ({ detail }) => {
  return (
    <div>
      {/* 상품상세화면 환경점수 구역 */}
      <div className="flex items-center justify-between border-t py-3 ">
        <span className="">환경점수</span>
        <span className="text-brand-green text-2xl font-extrabold flex gap-3">
          <span>+</span>
          <span>{detail.environmentScore}p</span>
        </span>
      </div>
      <div className=" my-2 text-sm text-brand-darkgray border-b pb-3 space-y-1">
        <div>환경을 생각하는 {detail.seller?.sellerNickName}님, </div>
        <div>
          이 상품은 환경에 기여한 점수
          <span className="font-bold"> {detail.environmentScore}점</span>의
          물품으로,
        </div>
        <div> 새 제품 생산을 줄이는 데 큰 의미가 있는 선택이에요.</div>
      </div>
    </div>
  );
};
export default DetailEcoScoreSection;
