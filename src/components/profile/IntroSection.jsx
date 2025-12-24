const IntroSection = ({
  intro,
  onChange,
  introError,
  maxLength,
  currentLength,
}) => {
  return (
    <div>
      <label className="block mb-3 pl-1 text-base">한줄 소개</label>
      <textarea
        value={intro ?? ""}
        onChange={onChange}
        rows={3}
        className="w-full border rounded-xl py-2 px-5 text-base resize-none"
      />
      <div className="pl-2 text-xs">
        <div className=" text-brand-mediumgray">
          ({currentLength} / {maxLength}자)
        </div>
        {introError && <div className=" text-brand-red">{introError}</div>}
      </div>
    </div>
  );
};

export default IntroSection;
