const EcoScoreSection = ({
  caption = "", // undefined 일 때 방어
  tags = [],
  score = null,
  loading = false,
  error = "",
  draftLoading = false,
  draftDone = false,
  draftError = "",
}) => {
  return (
    <div className="mt-8 mb-20">
      <p className="font-bold py-3 border-b text-lg">환경 점수</p>

      <div className="bg-brand-green text-white w-full p-3 py-3 my-5 rounded-lg text-md font-white">
        <div className="flex justify-between mb-3">
          <span>환경점수</span>
          <span>{score != null ? `${score}p` : "0p"}</span>
        </div>

        <div className="flex justify-between">
          <span>Vision 분석</span>
          <span>{loading ? "분석중" : caption ? "완료" : "대기"}</span>
        </div>

        {caption && (
          <div className="mt-2 text-sm opacity-95">
            <div className="font-semibold">캡션</div>
            <div className="mt-1">{caption}</div>
          </div>
        )}

        {tags?.length > 0 && (
          <div className="mt-2 text-sm opacity-95">
            <div className="font-semibold">태그</div>
            <div className="mt-1">{tags.slice(0, 5).join(", ")}</div>
          </div>
        )}

        <div className="flex justify-between mt-3">
          <span>AI 자동 작성</span>
          <span>{draftLoading ? "작성중" : draftDone ? "완료" : "대기"}</span>
        </div>
      </div>

      {error && <p className="text-brand-red text-sm">{error}</p>}
      {draftError && <p className="text-brand-red text-sm">{draftError}</p>}
    </div>
  );
};

export default EcoScoreSection;
