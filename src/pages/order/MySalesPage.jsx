import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LongProductCard from "@/components/order/LongProductCard";
import {
  tradeFlowLabels,
  getTradeStatusKey,
} from "@/components/order/tradeFlow";
import { getTradeListApi, updateTradeStatusApi } from "@/common/api/trade.api";
import TradeActionStatusButton from "@/components/order/TradeActionStatusButton";
import TradeReviewButton from "@/components/order/TradeReviewButton";
import TradeFilterModal from "@/components/order/TradeFilterModal";
import {
  getStatusLabel,
  getPeriodLabel,
} from "@/components/order/filterOptions";
import { Badge } from "@/components/ui/badge";

const MySalesPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [tradeList, setTradeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState([]);
  const [filterFromDate, setFilterFromDate] = useState(null);
  const [filterToDate, setFilterToDate] = useState(null);

  // 필터 상태 계산
  const hasStatusFilter = filterStatus && filterStatus.length > 0;
  const hasPeriodFilter = !!(filterFromDate || filterToDate);
  const hasAnyFilter = hasStatusFilter || hasPeriodFilter;

  const fetchTradeList = async (overrideQuery) => {
    if (loading) return;
    setLoading(true);

    try {
      const query = {
        keyword: (overrideQuery?.keyword ?? keyword).trim(),
        role: "SALES",
        status: overrideQuery?.status ?? filterStatus,
        fromDate: overrideQuery?.fromDate ?? filterFromDate,
        toDate: overrideQuery?.toDate ?? filterToDate,
      };

      const data = await getTradeListApi(query);
      console.log("거래 목록 응답:", data);

      const fetched = Array.isArray(data) ? data : data?.content ?? [];

      // 숨기기 상품은 항상 포함, 그 외에는 trade 정보가 있는 애들만 노출
      const filtered = fetched.filter((t) => {
        if (t.isHidden) return true;
        return (
          t.tradeId != null && t.tradeStatus != null && t.tradeType != null
        );
      });

      setTradeList(filtered);
    } catch (err) {
      console.error("상품 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 처음 들어왔을 때 한번 호출
  useEffect(() => {
    fetchTradeList();
  }, []);

  // 검색폼 제출 시 서버 호출
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTradeList();
  };

  const handleUpdateCompleteTrade = async (tradeId) => {
    try {
      await updateTradeStatusApi({
        tradeId,
        nextStatus: "COMPLETED",
      });

      // 상태 변경 성공 후 목록 다시 불러오기
      await fetchTradeList();
    } catch (err) {
      console.error("거래 완료로 변경 실패:", err);
    }
  };

  // 모달에서 받은 필터 값으로 상태를 갱신한 뒤 API 재요청
  const handleFilterApply = (selectedStatus, fromDate, toDate) => {
    // 로컬 상태에 저장
    setFilterStatus(selectedStatus);
    setFilterFromDate(fromDate);
    setFilterToDate(toDate);

    // 필터를 적용해서 목록 재조회
    fetchTradeList({
      status: selectedStatus,
      fromDate,
      toDate,
    });

    // 모달 닫기
    setIsFilterOpen(false);
  };

  const goToTradeDetail = (tradeId) => {
    navigate(`/trades/${tradeId}`);
  };

  return (
    <div className="flex flex-col p-2 gap-4 max-w-full -mt-8">
      <div className="w-full">
        <form className="relative" onSubmit={handleSubmit}>
          <Input
            placeholder="상품명을 검색해주세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <Button
              type="button"
              className="absolute right-8 top-1/2 -translate-y-1/2 h-4 w-4"
              onClick={() => {
                setKeyword("");
                fetchTradeList({ keyword: "" });
              }}
            >
              <XCircle />
            </Button>
          )}
          <Button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Button
          type="button"
          className="flex flex-row items-center gap-2 py-6 text-black font-normal"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter />
          {hasAnyFilter ? (
            <div className="flex flex-wrap gap-1">
              {/* 상태 뱃지 */}
              {hasStatusFilter &&
                filterStatus.map((value) => (
                  <Badge key={value} variant="line">
                    {getStatusLabel(value)}
                  </Badge>
                ))}

              {/* 기간 뱃지 */}
              {hasPeriodFilter && (
                <Badge variant="line">
                  {getPeriodLabel(filterFromDate, filterToDate)}
                </Badge>
              )}
            </div>
          ) : (
            <span>전체</span>
          )}
        </Button>
        {/* 필터 모달 */}
        {isFilterOpen && (
          <TradeFilterModal
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterApply}
            mode="sales"
            initialStatuses={filterStatus}
            initialFromDate={filterFromDate}
            initialToDate={filterToDate}
          />
        )}
        <div className="flex flex-col gap-4">
          {tradeList.map((trade) => {
            const {
              tradeId,
              productId,
              tradeStatus,
              tradeType,
              isHidden: productIsHidden,
              isDirect,
              isDelivery,
              productTitle,
              sellPrice,
              thumbnailUrl,
              createdAt,
              reviewStatus,
            } = trade;

            const hasTrade =
              tradeId != null && tradeStatus != null && tradeType != null;

            const statusDesc = hasTrade ? tradeStatus.description : null;

            // 상태 관련 플래그
            const isCanceled = statusDesc === "취소";
            const isHidden = productIsHidden === true;
            const hideActions = isCanceled || isHidden;

            // 거래가 있는 경우만 flowType/상태 계산
            const flowType = hasTrade ? tradeFlowLabels({ tradeType }) : null;

            const statusKey = hasTrade ? tradeStatus.name : null;
            const tradeStatusKey = getTradeStatusKey(statusDesc, statusKey);

            return (
              <div key={tradeId ?? productId}>
                <div className="flex flex-row justify-between p-2 items-center">
                  <span>{createdAt?.split("T")[0]?.replaceAll("-", ".")}</span>
                  <XCircle className="w-4.5 h-4.5" />
                </div>

                <div
                  className="flex flex-col gap-2 border border-brand-mediumgray rounded-2xl p-5"
                  onClick={() =>
                    hasTrade
                      ? goToTradeDetail(tradeId)
                      : navigate(`/products/${productId}`)
                  }
                >
                  <LongProductCard
                    productTitle={productTitle}
                    sellPrice={sellPrice}
                    tradeType={tradeType}
                    isDirect={isDirect}
                    isDelivery={isDelivery}
                    tradeStatus={statusDesc}
                    thumbnailUrl={thumbnailUrl}
                    isHidden={isHidden}
                  />

                  {!hideActions && hasTrade && (
                    <TradeActionStatusButton
                      trade={trade}
                      flowType={flowType}
                      tradeStatusKey={tradeStatusKey}
                      mode="sales"
                      onComplete={() => {
                        handleUpdateCompleteTrade(tradeId);
                        confirm("거래완료로 변경하시겠습니까?");
                      }}
                    />
                  )}

                  {/* 거래완료 상태 + 후기 버튼 */}
                  {hasTrade && !isHidden && tradeStatusKey === "COMPLETED" && (
                    <TradeReviewButton
                      tradeId={tradeId}
                      reviewStatus={reviewStatus}
                    />
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

export default MySalesPage;
