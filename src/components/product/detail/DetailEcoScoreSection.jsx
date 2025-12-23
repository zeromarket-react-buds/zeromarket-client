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
      <div className=" my-2 text-sm text-brand-darkgray border-b pb-3">
        <div>환경을 생각하는 {detail.seller?.sellerNickName}님, </div>
        <div> 이 물품을 구입하면 30mg 탄소절감이 됩니다! </div>
      </div>
    </div>
  );
};
export default DetailEcoScoreSection;
