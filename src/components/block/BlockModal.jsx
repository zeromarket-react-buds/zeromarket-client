import { Button } from "@/components/ui/button";

const BlockModal = ({ sellerId, onClose, onApply }) => {
  // 적용 버튼 클릭시 차단후 모달 닫기
  const handleApply = () => {
    onApply({ blockedUserId: Number(sellerId) });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[25em] p-6 rounded-lg shadow-xl text-center">
        <h2 className="font-semibold mb-4">차단하시겠습니까?</h2>
        <div className="flex flex-row gap-2">
          <Button
            variant="line"
            className="flex-1 py-2 rounded-lg"
            onClick={onClose}
          >
            취소
          </Button>
          <Button
            variant="red"
            className="flex-1 py-2 rounded-lg"
            onClick={handleApply}
          >
            차단하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
