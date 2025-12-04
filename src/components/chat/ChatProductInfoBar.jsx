import LongProductCard from "@/components/order/LongProductCard";
import ChangeStatusButtons from "@/components/chat/ChangeStatusButtons";

const ChatProductInfoBar = (productProps) => {
  return (
    <div className="p-4">
      <LongProductCard {...productProps} />
      <ChangeStatusButtons />
    </div>
  );
};

export default ChatProductInfoBar;
