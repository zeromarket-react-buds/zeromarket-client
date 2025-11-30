import { cn } from "@/lib/utils";
import { tradeFlows } from "@/components/order/tradeFlow";

const TradeStatusBar = ({ flowType, status, className = "" }) => {
  const steps = tradeFlows[flowType] || [];

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className={cn("flex flex-col max-w-full", className)}>
      <div className="flex w-full items-center">
        {steps.map((step, index) => {
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          // 현재 인덱스 이하만 녹색으로 점 활성화
          const isDotActive = index <= currentIndex;

          return (
            <div
              key={`${step.key}-${index}`}
              className="relative flex-1 flex items-center"
            >
              {/* 각 step의 점을 기준으로 좌측 구간 선 */}
              {!isFirst && (
                <div
                  className={[
                    "absolute left-0 right-1/2 h-1",
                    // 현재 단계에 도달했거나 이미 지나온 단계라면 녹색으로 처리
                    index <= currentIndex
                      ? "bg-brand-green"
                      : "bg-brand-mediumgray",
                  ].join(" ")}
                />
              )}

              {/* 각 step의 점을 기준으로 우측 구간 선 */}
              {!isLast && (
                <div
                  className={[
                    "absolute left-1/2 right-0 h-1",
                    // 이 점보다 왼쪽 구간만 녹색으로 처리
                    index <= currentIndex - 1
                      ? "bg-brand-green"
                      : "bg-brand-mediumgray",
                  ].join(" ")}
                />
              )}

              {/* 점 (현재 index 포함 이하만 초록) */}
              <div
                className={[
                  "h-4 w-4 rounded-full mx-auto z-5",
                  isDotActive ? "bg-brand-green" : "bg-brand-mediumgray",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>

      {/* 라벨 */}
      <div className="mt-2 flex w-full">
        {steps.map((step, index) => {
          const isCurrent = index === currentIndex;

          return (
            <div
              key={`${step.key}-label-${index}`}
              className="flex-1 text-center text-sm font-semibold"
            >
              <span
                className={
                  isCurrent ? "text-brand-green" : "text-brand-mediumgray"
                }
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradeStatusBar;
