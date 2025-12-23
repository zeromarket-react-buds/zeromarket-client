const EcoScoreSection = ({ score = null }) => {
  return (
    <div className="mt-8 mb-20">
      <p className="font-bold py-3 border-b text-lg">환경 점수</p>

      <div className="bg-brand-green text-white w-full p-3 py-3 my-5 rounded-lg text-md font-white">
        <div className="flex justify-between">
          <span>환경점수</span>
          <span>{score != null ? `${score}p` : "0p"}</span>
        </div>
      </div>
    </div>
  );
};

export default EcoScoreSection;
