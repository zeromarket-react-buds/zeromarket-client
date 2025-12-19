import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMyAddresses } from "@/common/api/address.api";
import { usePurchase } from "@/hooks/PurchaseContext";

const AddressCard = ({ address, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 text-sm cursor-pointer
        ${selected ? "border-green-600" : "border-gray-200"}`}
    >
      {/* 배송지명 */}
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-sm">
          {address.name || "배송지"}
        </span>
        {address.isDefault && (
          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
            대표 배송지
          </span>
        )}
      </div>

      {/* 받는 사람 */}
      <div className="font-medium">{address.receiverName}</div>
      <div className="text-gray-700">{address.receiverPhone}</div>

      {/* 주소 */}
      <div className="text-gray-500 text-xs mt-1">
        {address.zipcode} {address.addrBase} {address.addrDetail}
      </div>
    </div>
  );
};

const AddressListPage = () => {
  const navigate = useNavigate();

  const { productId } = useParams();

  const { setAddressId } = usePurchase();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleUpdate = (addressId) => {
    // console.log(addressId);
    setSelectedId(addressId);
    setAddressId(addressId);
  };

  useEffect(() => {
    getMyAddresses().then((data) => {
      setAddresses(data);

      const defaultAddress = data.find((a) => a.isDefault);
      if (defaultAddress) handleUpdate(defaultAddress.addressId);
    });
  }, []);

  return (
    <div className="max-w-md mx-auto pb-28">
      <header className="p-4 font-semibold">배송지 관리</header>

      {/* 안내 문구 */}
      <div className="px-4 text-sm text-gray-500 mb-3">
        {addresses.length === 0 && (
          <>
            "등록된 배송지 정보가 없습니다."
            <br />
          </>
        )}
        배송지는 최대 5개까지 등록할 수 있습니다.
      </div>

      {/* 배송지 추가 */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate("/addresses/new")}
          className="w-full border rounded-lg py-3 text-sm"
        >
          + 배송지 추가
        </button>
      </div>

      {/* 배송지 목록 */}
      <div className="px-4 space-y-3">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.addressId}
            address={addr}
            selected={selectedId === addr.addressId}
            onClick={() => handleUpdate(addr.addressId)}
          />
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4">
        <button
          className="w-full bg-green-700 text-white py-3 rounded-lg"
          disabled={!selectedId}
          onClick={() => {
            // 선택된 주소를 이전 화면(주문 등)에 전달
            navigate(`/purchase/${productId}/payment`, {
              state: { addressId: selectedId },
            });
          }}
        >
          선택
        </button>
      </div>
    </div>
  );
};

export default AddressListPage;
