import { Button } from "@/components/ui/button";

const LocationNameSheet = ({ isOpen, onClose, onSubmit, onChange, value }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="absolute bottom-0 left-0 right-0
                   bg-white rounded-t-2xl p-5"
        style={{ paddingBottom: "calc(13px + env(safe-area-inset-bottom))" }}
      >
        <h3 className="font-bold text-lg my-2">
          선택한 곳의 장소명을 입력해주세요.
        </h3>
        <p className="text-sm text-brand-darkgray mb-4">
          예) 강남역 1번 출구, 교보타워 앞
        </p>

        <input
          className="w-full border rounded-lg px-4 py-3 mb-4"
          placeholder="예) 강남역 1번 출구"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <Button
          variant="green"
          className="w-full py-7 text-lg"
          disabled={!value || !value.trim()}
          onClick={onSubmit}
        >
          거래 장소 등록
        </Button>
      </div>
    </div>
  );
};
export default LocationNameSheet;
