import { useParams } from "react-router-dom";

const TradeDetailPage = () => {
  const { tradeId } = useParams();

  return (
    <div>
      <div>거래내역 화면</div>
      <div>tradeId: {tradeId}</div>
    </div>
  );
};

export default TradeDetailPage;
