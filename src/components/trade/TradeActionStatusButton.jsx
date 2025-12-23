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

  // 구매자 취소 가능 조건
  // - CHAT_DIRECT: PENDING일 때만
  // - INSTANT_*: PAID일 때만
  const canBuyerCancel =
    isInProgress &&
    !isHidden &&
    mode === "purchases" &&
    ((flowType === "CHAT_DIRECT" && displayStatusKey === "PENDING") ||
      (flowType !== "CHAT_DIRECT" && displayStatusKey === "PAID"));

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

      {/* 구매자 입장: 주문 취소 요청 버튼만 노출 */}
      {canBuyerCancel && (
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

      {/* 판매자 입장 */}
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

          {/* 채팅 직거래 (order 없음) - 판매자만 완료/취소 가능 */}
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
        </>
      )}
    </div>
  );
};

export default TradeActionStatusButton;
