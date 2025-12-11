import { Button } from "@/components/ui/button";
const EcoScoreSection = () => {
  return (
    <div className="mt-8 mb-20">
      {/* 상품등록화면 환경 점수 - 2,3차 개발*/}
      <p className="font-bold py-3 border-b text-lg">환경 점수</p>
      <Button
        className="w-full p-3 py-6 my-5 flex justify-between rounded-lg text-md font-white "
        variant="green"
      >
        <span>환경점수</span>
        <span>100p</span>
      </Button>
    </div>
  );
};
export default EcoScoreSection;
