import { Button } from "@/components/ui/button";
import TradeStatusBar from "@/components/order/TradeStatusBar";

const TradeActionStatusButton = ({
  flowType,
  tradeStatusKey,
  mode,
  showStatusBar = true,
  isHidden,
  onComplete,
  onCancel,
}) => {
  const isPending = tradeStatusKey === "PENDING";

  return (
    <div className="flex flex-col gap-2">
      {/* 상태바 영역 */}
      {showStatusBar && (
        <div className="flex justify-center py-3">
          <TradeStatusBar
            flowType={flowType}
            status={tradeStatusKey}
            className="w-[35em]"
          />
        </div>
      )}

      {/* 진행 중(PENDING) 상태에서의 버튼들 */}
      {isPending && mode === "sales" && !isHidden && (
        <>
          {(flowType === "INSTANT_DELIVERY" ||
            flowType === "INSTANT_DIRECT") && (
            <div className="flex flex-row w-full gap-2">
              <Button
                variant="ivory"
                type="button"
                onClick={(e) => e.stopPropagation()}
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

          {flowType === "CHAT_DIRECT" && (
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

      {isPending && mode === "purchases" && (
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
