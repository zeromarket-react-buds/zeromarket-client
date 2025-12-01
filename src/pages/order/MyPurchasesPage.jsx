import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LongProductCard from "@/components/order/LongProductCard";
import TradeStatusBar from "@/components/order/TradeStatusBar";
import { tradeFlowLabels, tradeFlows } from "@/components/order/tradeFlow";

// 라벨에서 키로 매핑
const TradestatusKeyByLabel = Object.values(tradeFlows).reduce((acc, steps) => {
  steps.forEach((step) => {
    acc[step.label] = step.key;
  });
  return acc;
}, {});

const MyPurchasesPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const [tradeList, setTradeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTradeList = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (keyword.trim()) params.set("keyword", keyword.trim());

      const res = await fetch(
        `http://localhost:8080/api/trades?${params.toString()}`
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("비정상 응답:", text);
        return;
      }

      const data = await res.json();
      console.log("서버 응답:", data);

      const fetched = Array.isArray(data) ? data : data.content ?? [];

      setTradeList(fetched);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  //처음 들어왔을 때 한번 호출
  useEffect(() => {
    fetchTradeList(); // 첫 목록 조회
  }, []);

  // 검색폼 제출 시 서버 호출
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTradeList();
  };

  const goToTradeDetail = (tradeId) => {
    navigate(`/trades/${tradeId}`);
  };

  return (
    <div className="flex flex-col p-2 gap-4 max-w-full">
      <div className="w-full">
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            placeholder="상품명을 검색해주세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button
            type="button"
            className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4"
            onClick={() => setKeyword("")}
          >
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

        <div className="flex flex-col gap-4">
          {tradeList.map((trade) => {
            const flowType = tradeFlowLabels({
              isDelivery: trade.isDelivery,
              isDirect: trade.isDirect,
            });

            // 여기서 라벨을 키로 변환
            const tradeStatusKey =
              TradestatusKeyByLabel[trade.tradeStatus.description];

            return (
              <div key={trade.tradeId}>
                <div className="flex flex-row justify-between p-2 items-center">
                  <span>
                    {trade.createdAt?.split("T")[0]?.replaceAll("-", ".")}
                  </span>
                  <XCircle className="w-4.5 h-4.5" />
                </div>
                <div
                  className="flex flex-col gap-2 border border-brand-mediumgray rounded-2xl p-5"
                  onClick={() => goToTradeDetail(trade.tradeId)}
                >
                  <LongProductCard
                    productId={trade.productId}
                    productTitle={trade.productTitle}
                    sellPrice={trade.sellPrice}
                    tradeType={trade.tradeType.description}
                    tradeStatus={trade.tradeStatus.description}
                    thumbnailUrl={trade.thumbnailUrl}
                  />

                  {trade.tradeStatus.description === "취소" ? (
                    <div className="-my-1"></div>
                  ) : (
                    <div className="flex justify-center py-3">
                      <TradeStatusBar
                        flowType={flowType}
                        status={tradeStatusKey}
                        className="w-[35em]"
                      />
                    </div>
                  )}

                  {/* 예약중/결제완료 상태 */}
                  {tradeStatusKey === "PENDING" && (
                    <div>
                      <div className="flex flex-row w-full gap-2">
                        <Button
                          variant="green"
                          type="button"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 py-5"
                        >
                          주문 취소 요청
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 거래완료 상태 */}
                  {tradeStatusKey === "COMPLETED" && (
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyPurchasesPage;
