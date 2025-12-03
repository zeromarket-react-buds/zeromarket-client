import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TradeDetailPage = () => {
  const navigate = useNavigate();
  const { tradeId } = useParams();
  const [tradeProduct, setTradeProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTradeProduct = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      const res = await fetch(`http://localhost:8080/api/trades/${tradeId}`);

      if (!res.ok) {
        const text = await res.text();
        console.log("비정상 응답:", text);
        return;
      }

      const data = await res.json();
      setTradeProduct(data);
    } catch (e) {
      setTradeProduct(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTradeProduct();
  }, [tradeId]);

  // 로딩 화면
  if (loading && !tradeProduct) {
    return (
      <div className="p-4">
        <p>로딩 중입니다...</p>
      </div>
    );
  }

  // 안전장치: 아직 데이터가 없으면 아무것도 그리지 않음
  if (!tradeProduct) {
    return null;
  }

  const isDelivery = tradeProduct.tradeType.description === "택배거래";
  const isPending = tradeProduct.tradeStatus.description === "예약중";
  const isCanceled = tradeProduct.tradeStatus?.description === "취소";
  const isCompleted = tradeProduct.tradeStatus?.description === "거래완료";

  const getDisplayDate = () => {
    const { canceledAt, completedAt, updatedAt, createdAt } = tradeProduct;

    // 우선순위에 따라 값 선택
    const dateString =
      canceledAt ?? completedAt ?? updatedAt ?? createdAt ?? null;

    // 날짜 문자열 처리
    return dateString.split("T")[0].replaceAll("-", ".");
  };

  return (
    <div className="flex flex-col -mt-8">
      <div className="flex bg-black text-white justify-between p-4">
        <span>거래번호 {tradeId}</span>
        <span className="text-brand-lightgray">{getDisplayDate()}</span>
      </div>

      <div className="flex flex-col px-4">
        <div className="flex flex-col gap-2 py-6">
          {/* 거래상태 */}
          <div className="flex flex-col py-2 gap-2 text-lg">
            {isCanceled ? (
              <div className="text-brand-red font-semibold">거래취소</div>
            ) : isCompleted ? (
              <div className="text-brand-green font-semibold">거래완료</div>
            ) : isDelivery && isPending ? (
              <div className="text-brand-mediumgray font-semibold">
                결제완료
              </div>
            ) : (
              <div className="text-brand-mediumgray font-semibold">
                {tradeProduct.tradeStatus?.description}
              </div>
            )}

            {isCanceled ? (
              <div className="font-semibold">
                판매자/구매자가 주문을 취소하였습니다
              </div>
            ) : isCompleted ? (
              <div className="font-semibold">거래가 완료되었습니다</div>
            ) : (
              <div className="font-semibold">
                판매자에게 주문 확인을 요청해주세요
              </div>
            )}
          </div>

          {/* productCard 같은 부분 */}
          <div
            className="flex flex-row gap-10 pt-2 pb-5 items-center"
            onClick={() => navigate(`/products/${tradeProduct.productId}`)}
          >
            <div className="overflow-hidden">
              <img
                src={tradeProduct.thumbnailUrl}
                className="object-cover w-[100px] h-[70px] rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>{tradeProduct.productTitle}</div>
              <div>{tradeProduct.sellPrice.toLocaleString()}원</div>
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
                <span>{tradeProduct.nickname}</span>
              </div>
            </div>

            {/* 택배거래일 때만 노출 */}
            {isDelivery && (
              <div>
                <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
                  <div className="text-black text-lg font-semibold py-2">
                    배송지 정보
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>이름</span> <span>{tradeProduct.name}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>연락처</span> <span>{tradeProduct.phone}</span>
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
                <span>결제일시</span>
                <span>
                  {tradeProduct.createdAt.split("T")[0]?.replaceAll("-", ".")}
                </span>
              </div>
              <div className="flex flex-row justify-between">
                <span>거래방법</span>
                <span>{tradeProduct.tradeType.description}</span>
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
                <span>상품금액</span>
                <span>{tradeProduct.sellPrice.toLocaleString()}원</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>안심결제 수수료</span> <span>0원</span>
              </div>
            </div>
          </div>
        </div>
        {/* 최종결제 금액 */}
        <div className="flex flex-row justify-between text-lg font-semibold py-6">
          <span>최종 결제 금액</span>
          <span className="text-brand-green">
            {tradeProduct.sellPrice.toLocaleString()}원
          </span>
        </div>
        {/* 안내사항 */}
        <div className="flex flex-col border-t border-brand-mediumgray p-2">
          <div className="text-lg font-semibold py-2">안내사항</div>

          {isCanceled ? (
            <div className="text-brand-mediumgray text-sm">
              판매자/구매자가 거래를 취소하였습니다.
              <br />
              결제금이 환불되지 않았을 경우 문의 주세요
            </div>
          ) : (
            <div className="text-brand-mediumgray text-sm">
              판매자가 계속해서 주문 확인하지 않을 경우, 거래가 진행되지 않을
              경우
              <br />
              거래가 진행되지 않습니다. 구매를 원하지 않으실 경우 [구매 취소]
              해주세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeDetailPage;
