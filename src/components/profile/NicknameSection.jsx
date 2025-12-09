const NicknameSection = ({
  nickname,
  onChange,
  lengthError,
  dupError,
  isChecking,
  currentLength,
  maxLength,
}) => {
  return (
    <div className="mb-6">
      <label className="block mb-3 pl-1 text-base">닉네임</label>

      <input
        value={nickname}
        onChange={onChange}
        className="w-full border border-brand-green rounded-xl py-2 px-6 text-base"
      />

      <div className="mt-1 pl-2 text-xs">
        {/* 길이 안내 */}
        <div className=" text-brand-mediumgray">
          ({currentLength} / {maxLength}자)
        </div>

        {/* 중복 체크 상태 */}
        {isChecking && (
          <div className=" text-brand-mediumgra">중복 확인 중</div>
        )}

        {/* 길이 에러 */}
        {lengthError && <div className=" text-brand-red">{lengthError}</div>}

        {/* 중복 에러 */}
        {dupError && <div className=" text-brand-red">{dupError}</div>}
      </div>
    </div>
  );
};

export default NicknameSection;
