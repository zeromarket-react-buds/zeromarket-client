import { Button } from "@/components/ui/button";
import { GreenCheckBox } from "@/components/ui/greencheckbox";

const StatusFilterSection = ({
  statusOptions,
  selectedStatuses,
  toggleStatus,
  mode,
}) => {
  // 구매내역에서는 숨기기 옵션은 안 보이게 처리
  const visibleStatusOptions =
    mode === "purchases"
      ? statusOptions.filter((option) => option.value !== "isHidden")
      : statusOptions;

  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="text-base font-semibold px-3">
        {mode === "purchases" ? <>거래상태</> : <>거래 · 상품상태</>}
      </div>

      <div>
        <div className="flex gap-4">
          {visibleStatusOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              className="text-black font-normal"
            >
              <GreenCheckBox
                label={option.label}
                value={option.value}
                name="tradeStatus"
                checked={selectedStatuses.includes(option.value)}
                onChange={(isChecked) => toggleStatus(option.value, isChecked)}
              />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusFilterSection;
