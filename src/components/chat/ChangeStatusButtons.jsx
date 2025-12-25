import { Button } from "@/components/ui/button";
import {
  processTradePendingApi,
  processTradeCompleteApi,
} from "@/common/api/chat.api";
import { useAuth } from "@/hooks/AuthContext";
import { useModal } from "@/hooks/useModal";

const ChangeStatusButtons = ({ onStatusChanged, ...productProps }) => {
  const { productId, sellerId, buyerId, tradeStatus, salesStatus } =
    productProps;

  console.log("productProps", productProps);
  const { user } = useAuth();
  const isMyProduct = user?.memberId === sellerId;
  const { alert, confirm } = useModal();

  const handleChangeStatus = async (targetStatus) => {
    if (targetStatus === "PENDING") {
      if (!(await confirm({ description: "예약하시겠습니까?" }))) {
        return;
      }
      await processTradePendingApi(productId, buyerId, async () => {
        await alert({ description: "예약 완료되었습니다." });
        onStatusChanged();
      });

      return;
    }

    if (targetStatus === "COMPLETE") {
      if (!(await confirm({ description: "거래완료하시겠습니까?" }))) {
        return;
      }
      await processTradeCompleteApi(productId, buyerId, async () => {
        await alert({ description: "거래 완료되었습니다." });
        onStatusChanged();
      });

      return;
    }
  };

  return (
    <div className="flex gap-2  my-0 pt-3 py-4">
      {isMyProduct && (
        <>
          {["FOR_SALE"].includes(salesStatus?.name) && (
            <Button
              className="flex-1 border font-bold bg-brand-green border-brand-green text-brand-ivory py-2"
              onClick={() => handleChangeStatus("PENDING")}
            >
              예약중으로
            </Button>
          )}
          {["FOR_SALE", "PENDING"].includes(salesStatus?.name) && (
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
