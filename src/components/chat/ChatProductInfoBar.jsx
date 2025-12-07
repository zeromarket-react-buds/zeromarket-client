import LongProductCard from "@/components/order/LongProductCard";
import ChangeStatusButtons from "@/components/chat/ChangeStatusButtons";

const ChatProductInfoBar = (productProps, onStatusChanged) => {
  return (
    <div className="p-4">
      <LongProductCard
        {...productProps}
        tradeStatus={productProps.tradeStatus?.description}
      />
      <ChangeStatusButtons
        {...productProps}
        onStatusChanged={onStatusChanged}
      />
    </div>
  );
};

export default ChatProductInfoBar;
