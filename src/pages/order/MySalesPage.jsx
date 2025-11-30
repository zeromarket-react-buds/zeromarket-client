import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LongProductCard from "@/components/order/LongProductCard";
import TradeStatusBar from "@/components/order/TradeStatusBar";
import { tradeFlowLabels } from "@/components/order/tradeFlow";

const mockTrade = {
  tradeId: 1,
  ProductId: 1,
  sellPrice: 300000,
  productTitle: "노트북",
  buyerId: 2,
  tradeType: "DIRECT",
  tradeStatus: "COMPLETED",
  isDirect: false,
  isDelivery: true,
  sellerDeleted: null,
  buyerDeleted: null,
  createdAt: "2025.11.29.",
  uptdateAt: null,
  completedAt: null,
  canceledAt: null,
};

const MySalesPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const flowType = tradeFlowLabels({
    isDelivery: mockTrade.isDelivery,
    isDirect: mockTrade.isDirect,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    goToTradeDetail();
  };

  const goToTradeDetail = () => {
    navigate(`/trades/${mockTrade.tradeId}`);
  };

  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div className="w-full">
        <form className="relative" onClick={handleSubmit}>
          <Input
            placeholder="상품명을 검색해주세요"
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4">
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <span className="flex flex-row gap-2 py-3">
          <Filter /> 전체
        </span>
        <div>
          <div className="flex flex-row justify-between p-2 items-center">
            <span>{mockTrade.createdAt}</span>
            <XCircle className="w-4.5 h-4.5" />
          </div>
          <div
            className="flex flex-col gap-2 border border-brand-mediumgray rounded-2xl p-5"
            onClick={handleSubmit}
          >
            <LongProductCard
              productTitle={mockTrade.productTitle}
              sellPrice={mockTrade.sellPrice}
              tradeType={mockTrade.tradeType}
              tradeStatus={mockTrade.tradeStatus}
            />
            <div className="flex justify-center py-3">
              <TradeStatusBar
                flowType={tradeFlowLabels({
                  isDelivery: mockTrade.isDelivery,
                  isDirect: mockTrade.isDirect,
                })}
                status={mockTrade.tradeStatus}
                className="w-[35em]"
              />
            </div>

            {/* 바로결제 - 결제완료 상태 */}
            {mockTrade.tradeStatus === "PENDING" &&
              (flowType === "INSTANT_DELIVERY" ||
                flowType === "INSTANT_DIRECT") && (
                <div>
                  <div className="flex flex-row w-full gap-2">
                    <Button variant="ivory" className="flex-1 py-5">
                      주문 확인으로 변경
                    </Button>
                    <Button variant="green" className="flex-1 py-5">
                      거래 취소
                    </Button>
                  </div>
                </div>
              )}

            {/* 채팅 - 예약중 상태 */}
            {mockTrade.tradeStatus === "PENDING" &&
              flowType === "CHAT_DIRECT" && (
                <div>
                  <div className="flex flex-row w-full gap-2">
                    <Button
                      variant="ivory"
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-5"
                    >
                      거래 완료로 변경
                    </Button>
                    <Button
                      variant="green"
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 py-5"
                    >
                      거래 취소
                    </Button>
                  </div>
                </div>
              )}

            {/* 거래완료 상태 */}
            {mockTrade.tradeStatus === "COMPLETED" && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row ">
                  <Button
                    variant="green"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-5"
                  >
                    후기 보내기
                  </Button>{" "}
                </div>
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="green"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-5"
                  >
                    후기 보내기
                  </Button>
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-5"
                  >
                    받은 후기 보기
                  </Button>
                </div>
                <div className="flex flex-row w-full">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full py-5"
                  >
                    받은 후기 보기
                  </Button>{" "}
                </div>
                <div className="flex flex-row w-full gap-2">
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-5"
                  >
                    보낸 후기 보기
                  </Button>
                  <Button
                    variant="ivory"
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-5"
                  >
                    받은 후기 보기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySalesPage;
