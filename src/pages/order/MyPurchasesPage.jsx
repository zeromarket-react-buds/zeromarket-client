import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LongProductCard from "@/components/order/LongProductCard";
import {
  getTradeStatusKey,
  tradeFlowLabels,
} from "@/components/order/tradeFlow";
import {
  getTradeListApi,
  updateTradeStatusApi,
  softDeleteTradeApi,
} from "@/common/api/trade.api";
import TradeReviewButton from "@/components/order/TradeReviewButton";
import TradeActionStatusButton from "@/components/order/TradeActionStatusButton";
import TradeFilterModal from "@/components/order/TradeFilterModal";
import {
  getStatusLabel,
  getPeriodLabel,
} from "@/components/order/filterOptions";
import { Badge } from "@/components/ui/badge";
import { useTradeToast } from "@/components/GlobalToast";
import { useModal } from "@/hooks/useModal";

const MyPurchasesPage = () => {
  const { confirm } = useModal();
  const navigate = useNavigate();
  const { showCanceledUpdatedToast, showSoftDeletedToast } = useTradeToast();

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
        role: "PURCHASES",
        status: overrideQuery?.status ?? filterStatus,
        fromDate: overrideQuery?.fromDate ?? filterFromDate,
        toDate: overrideQuery?.toDate ?? filterToDate,
      };

      const data = await getTradeListApi(query);
      console.log("거래 목록 응답 :", data);

      const fetched = Array.isArray(data) ? data : data?.content ?? [];

      setTradeList(fetched);
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

  const handleUpdateCancelTrade = async (tradeId) => {
    const ok = await confirm({
      description: "거래를 취소하시겠습니까?",
      confirmText: "거래 취소",
      variant: "destructive",
    });

    if (!ok) return;

    try {
      await updateTradeStatusApi({
        tradeId,
        nextStatus: "CANCELED",
      });

      // 거래 취소 성공 후 목록 다시 불러오기
      await fetchTradeList();
      showCanceledUpdatedToast();
    } catch (err) {
      console.error("거래 취소로 변경 실패:", err);
    }
  };

  const handleSoftDeleteTrade = async (tradeId) => {
    const ok = await confirm({
      description: "거래 내역을 삭제하겠습니까?",
      confirmText: "삭제",
      variant: "destructive",
    });

    if (!ok) return;

    try {
      await softDeleteTradeApi({
        tradeId,
        deletedBy: "BUYER",
      });

      await fetchTradeList();
      showSoftDeletedToast();
    } catch (err) {
      console.error("거래 내역 삭제 실패:", err);
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
            mode="purchases"
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

            // 거래가 있는 경우만 flowType/상태 계산
            const flowType = hasTrade ? tradeFlowLabels({ tradeType }) : null;

            const statusKey = hasTrade ? tradeStatus.name : null;
            const tradeStatusKey = getTradeStatusKey(statusDesc, statusKey);

            // 상태 관련 변수들
            const isCanceled = statusDesc === "취소";
            const isHidden = productIsHidden === true;
            const hideActions = isCanceled || isHidden;
            const isCompleted = tradeStatusKey === "COMPLETED";

            // 숨기기 뱃지 별도로 계산 (구매내역에서는 완료나 취소 상태일 땐 숨기기 뱃지 표시 X)
            const isHiddenBadge =
              productIsHidden === true && !isCanceled && !isCompleted;

            return (
              <div key={tradeId}>
                <div className="flex flex-row justify-between p-2 items-center">
                  <span>{createdAt?.split("T")[0]?.replaceAll("-", ".")}</span>
                  <Button
                    onClick={() => handleSoftDeleteTrade(tradeId)}
                    className="-mr-3"
                  >
                    <XCircle className="w-4.5 h-4.5" />
                  </Button>
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
                    productId={productId}
                    productTitle={productTitle}
                    sellPrice={sellPrice}
                    tradeType={tradeType}
                    isDirect={isDirect}
                    isDelivery={isDelivery}
                    tradeStatus={statusDesc}
                    thumbnailUrl={thumbnailUrl}
                    isHidden={isHiddenBadge}
                  />

                  {!hideActions && hasTrade && (
                    <TradeActionStatusButton
                      trade={trade}
                      flowType={flowType}
                      tradeStatusKey={tradeStatusKey}
                      mode="purchases"
                      onCancel={() => {
                        handleUpdateCancelTrade(tradeId);
                      }}
                    />
                  )}

                  {/* 거래완료 상태 + 후기 버튼 */}
                  {hasTrade && tradeStatusKey === "COMPLETED" && (
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

export default MyPurchasesPage;
