import { useNavigate } from "react-router-dom";

const AddressListPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto pb-24">
      <header className="p-4 font-semibold">배송지 관리</header>

      {/* 배송지 목록 (생략) */}

      <div className="p-4">
        <button
          onClick={() => navigate("/addresses/new")}
          className="w-full border rounded-lg py-3 font-medium"
        >
          + 배송지 추가
        </button>
      </div>
    </div>
  );
};

export default AddressListPage;
