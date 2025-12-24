import { Button } from "@/components/ui/button";
import TradeStatusBar from "@/components/trade/TradeStatusBar";

const TradeActionStatusButton = ({
  flowType,
  displayStatusKey,
  mode,
  showStatusBar = true,
  isHidden,
  onConfirmOrder,
  onDeliveryCompleted,
  onComplete,
  onCancel,
}) => {
  // 해당 거래가 아직 진행 중인지 여부 판단
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

      {/* 구매자 입장 */}
      {isInProgress && mode === "purchases" && !isHidden && (
        <>
          {/* 채팅 - 직거래 (order 없음) : 거래완료/거래취소 */}
          {flowType === "CHAT_DIRECT" && displayStatusKey === "PENDING" && (
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

          {/* 바로구매 - 직거래: 거래완료 */}
          {flowType === "INSTANT_DIRECT" &&
            displayStatusKey === "DELIVERY_READY" && (
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

          {/* 바로구매 - 택배거래: 거래완료 */}
          {flowType === "INSTANT_DELIVERY" &&
            displayStatusKey === "DELIVERED" && (
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

          {/* 바로구매 결제완료(PAID)에서만: 주문 취소 요청 */}
          {flowType !== "CHAT_DIRECT" && displayStatusKey === "PAID" && (
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
        </>
      )}

      {/* 판매자 입장 */}
      {isInProgress && mode === "sales" && !isHidden && (
        <>
          {/* 채팅 - 직거래 (order 없음) : 판매자는 취소만 */}
          {flowType === "CHAT_DIRECT" && displayStatusKey === "PENDING" && (
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
                거래 취소
              </Button>
            </div>
          )}

          {/* 바로구매 - 직거래: 결제완료에서 주문확인/거래취소 */}
          {flowType === "INSTANT_DIRECT" && displayStatusKey === "PAID" && (
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

          {/* 바로구매 - 택배거래 */}
          {flowType === "INSTANT_DELIVERY" && (
            <>
              {/* 결제완료에서 주문확인/거래취소 */}
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

              {/* 주문확인에서 배송완료로 변경 */}
              {displayStatusKey === "DELIVERY_READY" && (
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeliveryCompleted && onDeliveryCompleted();
                    }}
                    className="flex-1 py-5"
                  >
                    배송 완료로 변경
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TradeActionStatusButton;
