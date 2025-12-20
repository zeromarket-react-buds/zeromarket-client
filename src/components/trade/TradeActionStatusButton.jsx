import { Button } from "@/components/ui/button";
import TradeStatusBar from "@/components/trade/TradeStatusBar";

const TradeActionStatusButton = ({
  flowType,
  displayStatusKey,
  mode,
  showStatusBar = true,
  isHidden,
  onComplete,
  onCancel,
  onConfirmOrder,
}) => {
  const isInProgress =
    displayStatusKey !== "COMPLETED" && displayStatusKey !== "CANCELED";

  return (
    <div className="flex flex-col gap-2">
      {showStatusBar && (
        <div className="flex justify-center pt-4 pb-1">
          <TradeStatusBar
            flowType={flowType}
            status={displayStatusKey}
            className="w-[35em]"
          />
        </div>
      )}

      {/* 예약중(PENDING) 상태에서의 버튼들. 판매자 입장 */}
      {isInProgress && mode === "sales" && !isHidden && (
        <>
          {/* 바로구매 - 직거래 */}
          {flowType === "INSTANT_DIRECT" && (
            <>
              {displayStatusKey === "PAID" && (
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirmOrder && onConfirmOrder();
                    }}
                    className="flex-1 py-5"
                  >
                    주문 확인으로 변경
                  </Button>

                  <Button
                    variant="green"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel && onCancel();
                    }}
                    className="flex-1 py-5"
                  >
                    거래 취소
                  </Button>
                </div>
              )}

              {displayStatusKey === "DELIVERY_READY" && (
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete && onComplete();
                    }}
                    className="flex-1 py-5"
                  >
                    거래 완료로 변경
                  </Button>
                </div>
              )}
            </>
          )}

          {/* 바로구매 - 택배거래 */}
          {flowType === "INSTANT_DELIVERY" && (
            <>
              {/* 결제완료에서 주문확인으로 변경 */}
              {displayStatusKey === "PAID" && (
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onConfirmOrder && onConfirmOrder();
                    }}
                    className="flex-1 py-5"
                  >
                    주문 확인으로 변경
                  </Button>

                  <Button
                    variant="green"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancel && onCancel();
                    }}
                    className="flex-1 py-5"
                  >
                    거래 취소
                  </Button>
                </div>
              )}

              {/* 배송완료(DELIVERED)에서 거래완료로 변경 */}
              {displayStatusKey === "DELIVERED" && (
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete && onComplete();
                    }}
                    className="flex-1 py-5"
                  >
                    거래 완료로 변경
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* 예약중(PENDING) 상태에서의 버튼들. 구매자 입장 */}
      {mode === "purchases" && displayStatusKey === "PAID" && (
        <div className="flex flex-row w-full gap-2">
          <Button
            variant="green"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel && onCancel();
            }}
            className="flex-1 py-5"
          >
            주문 취소 요청
          </Button>
        </div>
      )}
    </div>
  );
};

export default TradeActionStatusButton;
