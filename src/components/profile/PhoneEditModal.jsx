const PhoneEditModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="bg-white p-6 rounded-xl z-50 w-[35em]">
          핸드폰 모달창
        </div>
      </div>
    </div>
  );
};

export default PhoneEditModal;
