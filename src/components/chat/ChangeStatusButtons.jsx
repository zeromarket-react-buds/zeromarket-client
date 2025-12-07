import { Button } from "@/components/ui/button";
import {
  processTradePendingApi,
  processTradeCompleteApi,
} from "@/common/api/chat.api";
import { useAuth } from "@/hooks/AuthContext";

const ChangeStatusButtons = ({ onStatusChanged, ...productProps }) => {
  const { productId, sellerId, buyerId, tradeStatus } = productProps;
  const { user } = useAuth();
  const isMyProduct = user?.memberId === sellerId;

  const handleChangeStatus = async (targetStatus) => {
    if (targetStatus === "PENDING") {
      if (!window.confirm("예약하시겠습니까?")) {
        return;
      }
      await processTradePendingApi(productId, buyerId, () => {
        alert("예약 완료되었습니다.");
        onStatusChanged();
      });

      return;
    }

    if (targetStatus === "COMPLETE") {
      if (!window.confirm("거래완료하시겠습니까?")) {
        return;
      }
      await processTradeCompleteApi(productId, buyerId, () => {
        alert("거래 완료되었습니다.");
        onStatusChanged();
      });

      return;
    }
  };

  return (
    <div className="flex gap-2  my-0 pt-3 py-4">
      {isMyProduct && (
        <>
          {!tradeStatus && (
            <Button
              className="flex-1 border font-bold bg-brand-green border-brand-green text-brand-ivory py-2"
              onClick={() => handleChangeStatus("PENDING")}
            >
              예약중으로
            </Button>
          )}
          {(!tradeStatus || tradeStatus.name === "PENDING") && (
            <Button
              className="flex-1 border font-bold bg-brand-green border-brand-green text-brand-ivory py-2"
              onClick={() => handleChangeStatus("COMPLETE")}
            >
              거래완료
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ChangeStatusButtons;
