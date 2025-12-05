import { Button } from "@/components/ui/button";
import { GreenCheckBox } from "@/components/ui/greencheckbox";

const StatusFilterSection = ({
  statusOptions,
  selectedStatuses,
  toggleStatus,
}) => {
  return (
    <div className="flex flex-col gap-3 py-3">
      <div className="text-base font-semibold px-3">거래 · 상품상태</div>

      <div>
        <div className="flex gap-4">
          {statusOptions.map((option) => (
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
