import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";

const tradeType = {
  DIRECT: "DIRECT",
  DELIVERY: "DELIVERY",
};

const TradeDetailPage = () => {
  const { tradeId } = useParams();

  const currentTradeType = tradeType.DELIVERY;

  return (
    <div className="flex flex-col -mt-8">
      <div className="flex bg-black text-white justify-between p-4">
        <span>거래번호 {tradeId}</span>
        <span className="text-brand-lightgray">절대날짜</span>
      </div>

      <div className="flex flex-col px-4">
        <div className="flex flex-col gap-2 py-6">
          {/* 거래상태 */}
          <div className="flex flex-col py-2 gap-2 text-lg">
            <div className="text-brand-mediumgray font-semibold">결제완료</div>
            <div className="font-semibold">
              판매자에게 주문 확인을 요청해주세요
            </div>
          </div>

          {/* productCard 같은 부분 */}
          <div className="flex flex-row gap-10 pt-2 pb-5 items-center">
            <div className="bg-brand-mediumgray w-[100px] h-[70px] rounded-2xl" />
            <div className="flex flex-col gap-2">
              <div>상품명</div>
              <div>가격</div>
            </div>
          </div>

          <Button variant="line" className="py-6">
            구매 취소
          </Button>
        </div>

        {/* 회색/흰색 박스 */}
        <div className="bg-brand-lightgray w-full h-full p-5">
          <div className="flex flex-col bg-white rounded-2xl p-6">
            {/* 판매자 정보 */}
            <div className="flex flex-col gap-2 py-4 text-lg font-semibold">
              <div className="flex flex-row justify-between items-center">
                <span>판매자 정보</span>
                <Button className="text-lg text-black px-0">
                  가게 보기 <ChevronRight className="-mr-3" />
                </Button>
              </div>
              <div className="flex flex-row justify-between ">
                <span className="text-brand-mediumgray">닉네임</span>
                <span>실제 닉네임</span>
              </div>
            </div>

            {/* 택배거래일 때만 노출 */}
            {currentTradeType === tradeType.DELIVERY && (
              <div>
                <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
                  <div className="text-black text-lg font-semibold py-2">
                    배송지 정보
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>이름</span> <span>실제 이름</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>연락처</span> <span>000-0000-0000</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>주소</span> <span>[우편번호] 주소</span>
                  </div>
                </div>
              </div>
            )}

            {/* 거래 정보 */}
            <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
              <div className="text-black text-lg font-semibold py-2">
                거래 정보
              </div>
              <div className="flex flex-row justify-between">
                <span>결제일시</span> <span>시간</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>거래방법</span> <span>택배거래</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>결제수단</span> <span>네이버 페이</span>
              </div>
            </div>

            {/* 결제 금액 안내 */}
            <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
              <div className="text-black text-lg font-semibold py-2">
                결제금액 정보
              </div>
              <div className="flex flex-row justify-between">
                <span>상품금액</span> <span>금액</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>안심결제 수수료</span> <span>0원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 최종결제 금액 */}
        <div className="flex flex-row justify-between text-lg font-semibold py-6">
          <span>최종 결제 금액</span>{" "}
          <span className="text-brand-green">금액</span>
        </div>

        {/* 안내사항 */}
        <div className="flex flex-col border-t border-brand-mediumgray p-2">
          <div className="text-lg font-semibold py-2">안내사항</div>
          <div className="text-brand-mediumgray text-sm">
            판매자가 계속해서 주문 확인하지 않을 경우, 거래가 진행되지 않을 경우
            <br />
            거래가 진행되지 않습니다. 구매를 원하지 않으실 경우 [구매 취소]
            해주세요.
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailPage;
