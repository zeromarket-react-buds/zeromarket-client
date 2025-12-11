const EnvGradeGuidePage = () => {
  return (
    <div className="-mt-5 px-15">
      {/* 환경점수 안내 영역 */}
      <div>
        <div className="text-2xl text-brand-green font-semibold py-3">
          환경점수는 뭔가요?
        </div>

        {/* 설명 문단들 */}
        <div className="space-y-1">
          <p className="indent-4">
            환경점수는 회원님이 제로마켓에서 중고거래를 통해 탄소 절감에 기여한
            정도를 수치로 나타낸 값입니다.
          </p>
          <p className="indent-4">
            새 제품을 구매하는 대신 중고 상품을 재사용할 때, 생산·포장·운송
            과정에서 발생하는 탄소 배출량이 줄어들게 되며, 그만큼의 절감량을 mg
            단위로 환산하고, 그에 따라 포인트로 적립합니다.
          </p>
          <p className="indent-4">
            이 점수는 단순한 포인트가 아니라, 회원님의 거래 하나하나가 지구 환경
            보호에 실제로 어떤 영향을 주었는지를 시각적으로 보여주는 지표입니다.
          </p>
        </div>
      </div>

      {/* 사용 방법 영역 */}
      <div className="py-2">
        <div className="text-2xl text-brand-green font-semibold mt-6 pb-3">
          어떻게 쓸 수 있나요?
        </div>

        {/* 적립 방법 */}
        <div className="font-semibold pb-1">적립 방법</div>
        <ul className="list-disc pl-5">
          <li>상품을 판매하거나 구매할 때 자동으로 환경점수가 적립됩니다.</li>
        </ul>

        {/* 사용 방법 */}
        <div className="font-semibold mt-4 py-1">사용 방법</div>
        <ul className="list-disc pl-5">
          <li>결제 단계에서 “환경점수 사용하기”를 선택하면 즉시 할인됩니다.</li>
          <li>1p은 1원으로 환산됩니다.</li>
        </ul>

        {/* 확인하기 */}
        <div className="font-semibold mt-4 py-1">확인하기</div>
        <ul className="list-disc pl-5">
          <li>마이페이지 → 환경점수에서 누적 점수를 확인할 수 있습니다.</li>
        </ul>

        {/* 추가 혜택 */}
        <div className="font-semibold mt-4 py-1">추가 혜택 (예정)</div>
        <ul className="list-disc pl-5">
          <li>일정 점수 이상 달성 시 이벤트에 참여할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvGradeGuidePage;
