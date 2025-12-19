import LongProductCard from "@/components/trade/LongProductCard";
import ChangeStatusButtons from "@/components/chat/ChangeStatusButtons";
import React from "react";

const ChatProductInfoBar = React.memo(({ ...props }) => {
  const { onStatusChanged, ...productProps } = props;
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
});

export default ChatProductInfoBar;
