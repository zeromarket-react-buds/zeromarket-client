import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import {
  getTradeDetailApi,
  updateTradeStatusApi,
} from "@/common/api/trade.api";
import TradeActionStatusButton from "@/components/trade/TradeActionStatusButton";
import TradeReviewButton from "@/components/trade/TradeReviewButton";
import {
  buildTradeViewState,
  getStatusLabelByKey,
} from "@/components/trade/tradeFlow";

import { useTradeToast } from "@/components/GlobalToast";
import formatPhone from "@/utils/formatPhone";
import { useModal } from "@/hooks/useModal";
import { useAuth } from "@/hooks/AuthContext";

// 공통 날짜 포맷 함수
const formatDate = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0].replaceAll("-", ".");
};

// 헤더용 날짜: 취소/완료/업데이트/생성 순으로 우선순위 세우는 함수
const getHeaderDate = (trade) => {
  if (!trade) return "";
  const { canceledAt, completedAt, updatedAt, createdAt } = trade;
  return formatDate(canceledAt ?? completedAt ?? updatedAt ?? createdAt);
};

const TradeDetailPage = () => {
  const { alert, confirm } = useModal();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { showCompletedUpdatedToast, showCanceledUpdatedToast } =
    useTradeToast();
  const { tradeId } = useParams();

  const [tradeProduct, setTradeProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTradeProduct = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getTradeDetailApi(tradeId);
      setTradeProduct(data);
    } catch (e) {
      setTradeProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      (async () => {
        await alert({ description: "거래내역은 로그인 후 접근이 가능합니다." });
        navigate("/login", { replace: true });
      })();
    }
  }, [authLoading, isAuthenticated, navigate, alert]);

  useEffect(() => {
    fetchTradeProduct();
  }, [tradeId]);

  // useMemo: 렌더 때마다 매번 재계산하지 않고 tradeProduct가 바뀔 때만 다시 계산. tradeProduct가 null이어도 훅은 항상 호출되게 처리
  const view = useMemo(() => {
    if (!tradeProduct) {
      // 방어 로직이 필요한 이유:
      // tradeProduct는 API/비동기 로딩 결과라서 초기 렌더에서는 null/undefined일 수 있음
      // 그 상태에서 buildTradeViewState(tradeProduct)를 호출하면 내부에서 tradeProduct.로 된 거 접근할때 런타임 에러가 날 수 있음
      // 구조 분해 할당을 항상 동일한 키로 안전하게 하기 위해 기본 형태를 반환함
      return {
        flowType: null,
        displayStatusKey: null,
        tradeStatusKey: null,
        orderStatusKey: null,
        isCanceled: false,
        isCompleted: false,
      };
    }
    return buildTradeViewState(tradeProduct);
  }, [tradeProduct]);

  const { flowType, displayStatusKey, isCanceled, isCompleted } = view;

  const displayStatusLabel = useMemo(() => {
    if (!flowType || !displayStatusKey) return "";
    return getStatusLabelByKey(flowType, displayStatusKey) ?? "";
  }, [flowType, displayStatusKey]);

  if (loading && !tradeProduct) {
    return (
      <div className="p-4">
        <p>로딩 중입니다...</p>
      </div>
    );
  }

  if (!tradeProduct) {
    return null;
  }

  const {
    memberId,
    sellerId,
    tradeType,
    isHidden,
    productId,
    thumbnailUrl,
    productTitle,
    sellPrice,
    nickname,
    name,
    phone,
    createdAt,
    canceledBy,
    reviewStatus,
  } = tradeProduct;

  // 이 거래에서의 내 역할 판별
  const isSeller = memberId != null && sellerId === memberId;
  // role 기준으로 mode 결정
  const mode = isSeller ? "sales" : "purchases";

  const isDelivery =
    tradeType?.name === "DELIVERY" || tradeType?.description === "택배거래";

  // 목록 페이지와 동일하게: 취소거나 숨기기면 버튼 숨김
  const hideActions = isHidden || isCanceled || isCompleted;

  const headerDate = getHeaderDate(tradeProduct);
  const paidDate = formatDate(createdAt);

  const handleUpdateCompleteTrade = async (tradeId) => {
    const ok = await confirm({
      description: "거래 완료로 변경하시겠습니까?",
      confirmText: "변경",
    });

    if (!ok) return;

    try {
      await updateTradeStatusApi({
        tradeId,
        nextStatus: "COMPLETED",
      });

      // 상태 변경 성공 후 목록 다시 불러오기
      await fetchTradeProduct();
      showCompletedUpdatedToast();
    } catch (err) {
      console.error("거래 완료로 변경 실패:", err);
    }
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
      await fetchTradeProduct();
      showCanceledUpdatedToast();
    } catch (err) {
      console.error("거래 취소로 변경 실패:", err);
    }
  };

  const handleConfirmOrder = async (tradeId) => {
    const ok = await confirm({
      description: "주문 확인 상태로 변경하시겠습니까?",
      confirmText: "변경",
    });

    if (!ok) return;

    try {
      await updateTradeStatusApi({
        tradeId,
        nextStatus: "DELIVERY_READY",
      });

      await fetchTradeProduct();
    } catch (err) {
      console.error("주문 확인으로 변경 실패:", err);
    }
  };

  return (
    <div className="flex flex-col -mt-8">
      <div className="flex bg-black text-white justify-between p-4">
        <span>거래번호 {tradeId}</span>
        <span className="text-brand-lightgray">{headerDate}</span>
      </div>

      <div className="flex flex-col px-4">
        <div className="flex flex-col gap-2 py-6">
          <div className="flex flex-col py-2 gap-2 text-lg">
            {isCanceled ? (
              <div className="text-brand-red font-semibold">거래취소</div>
            ) : isCompleted ? (
              <div className="text-brand-green font-semibold">거래완료</div>
            ) : (
              <div className="text-brand-mediumgray font-semibold">
                {displayStatusLabel}
              </div>
            )}

            <div className="font-semibold">
              {isCanceled
                ? canceledBy === "SELLER"
                  ? isSeller
                    ? "거래를 취소했습니다."
                    : "판매자가 거래를 취소했습니다."
                  : canceledBy === "BUYER"
                  ? isSeller
                    ? "구매자가 거래를 취소했습니다."
                    : "거래를 취소했습니다."
                  : null
                : isCompleted
                ? "거래가 완료되었습니다."
                : isSeller
                ? "구매자의 주문을 확인하고 거래를 진행해주세요."
                : "판매자에게 주문 확인을 요청해주세요."}
            </div>
          </div>

          <div
            className="flex flex-row gap-10 pt-2 pb-5 items-center"
            onClick={() => navigate(`/products/${productId}`)}
          >
            <div className="overflow-hidden">
              <img
                src={thumbnailUrl}
                className="object-cover w-[100px] h-[70px] rounded-2xl"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>{productTitle}</div>
              <div>{sellPrice.toLocaleString()}원</div>
            </div>
          </div>

          {isCompleted ? (
            <TradeReviewButton tradeId={tradeId} reviewStatus={reviewStatus} />
          ) : !hideActions ? (
            <TradeActionStatusButton
              flowType={flowType}
              displayStatusKey={displayStatusKey}
              mode={mode}
              isHidden={isHidden}
              onComplete={() => handleUpdateCompleteTrade(tradeId)}
              onCancel={() => handleUpdateCancelTrade(tradeId)}
              onConfirmOrder={() => handleConfirmOrder(tradeId)}
              showStatusBar={false}
            />
          ) : null}
        </div>

        <div className="bg-brand-lightgray w-full h-full p-5">
          <div className="flex flex-col bg-white rounded-2xl p-6">
            <div className="flex flex-col gap-2 py-4 text-lg font-semibold">
              <div className="flex flex-row justify-between items-center">
                <span>판매자 정보</span>
                <Button
                  className="text-lg text-black px-0"
                  onClick={() => navigate(`/sellershop/${sellerId}`)}
                >
                  가게 보기 <ChevronRight className="-mr-3" />
                </Button>
              </div>
              <div className="flex flex-row justify-between ">
                <span className="text-brand-mediumgray">닉네임</span>
                <span>{nickname}</span>
              </div>
            </div>

            {isDelivery && (
              <div>
                <div className="flex flex-col text-brand-mediumgray border-top border-brand-mediumgray gap-2 py-4">
                  <div className="text-black text-lg font-semibold py-2">
                    배송지 정보
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>이름</span> <span>{name}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>연락처</span> <span>{formatPhone(phone)}</span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span>주소</span> <span>[우편번호] 주소</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
              <div className="text-black text-lg font-semibold py-2">
                거래 정보
              </div>
              <div className="flex flex-row justify-between">
                <span>결제일시</span>
                <span>{paidDate}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>거래방법</span>
                <span>{tradeType?.description}</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>결제수단</span> <span>네이버 페이</span>
              </div>
            </div>

            <div className="flex flex-col text-brand-mediumgray border-t border-brand-mediumgray gap-2 py-4">
              <div className="text-black text-lg font-semibold py-2">
                결제금액 정보
              </div>
              <div className="flex flex-row justify-between">
                <span>상품금액</span>
                <span>{sellPrice.toLocaleString()}원</span>
              </div>
              <div className="flex flex-row justify-between">
                <span>안심결제 수수료</span> <span>0원</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between text-lg font-semibold py-6">
          <span>최종 결제 금액</span>
          <span className="text-brand-green">
            {sellPrice.toLocaleString()}원
          </span>
        </div>

        {!isCompleted ? (
          <div className="flex flex-col border-t border-brand-mediumgray p-2">
            <div className="text-lg font-semibold py-2">안내사항</div>

            {isCanceled ? (
              isSeller ? (
                <div className="text-brand-mediumgray text-sm">
                  거래가 취소되었습니다.
                  <br />
                  구매자에게 환불 등 필요 조치를 안내해주세요.
                </div>
              ) : (
                <div className="text-brand-mediumgray text-sm">
                  거래가 취소되었습니다.
                  <br />
                  결제금 환불이 처리되지 않았을 경우 문의해주세요.
                </div>
              )
            ) : isSeller ? (
              <div className="text-brand-mediumgray text-sm">
                판매자가 주문을 확인하지 않을 경우 거래가 진행되지 않을 수
                있습니다.
                <br />
                주문 확인 후 거래를 진행할 수 있습니다.
              </div>
            ) : (
              <div className="text-brand-mediumgray text-sm">
                판매자가 계속해서 주문 확인하지 않을 경우 거래가 진행되지
                않습니다.
                <br />
                구매를 원하지 않으실 경우 [구매 취소] 해주세요.
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TradeDetailPage;
