import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getMyAddresses } from "@/common/api/address.api";
import { useHeader } from "@/hooks/HeaderContext";
import Container from "@/components/Container";

const MAX = 5;

const AddressCard = ({ address, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`border rounded-lg p-4 text-sm cursor-pointer ${
      selected ? "border-green-600" : "border-gray-200"
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <span className="font-semibold text-sm">{address.name || "배송지"}</span>
      {address.isDefault && (
        <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
          기본 배송지
        </span>
      )}
    </div>

    <div className="font-medium">{address.receiverName}</div>
    <div className="text-gray-700">{address.receiverPhone}</div>

    <div className="text-gray-500 text-xs mt-1">
      {address.zipcode} {address.addrBase} {address.addrDetail}
    </div>
  </div>
);

const AddressListPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const { setHeader, resetHeader } = useHeader();

  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const tradeType = searchParams.get("tradeType"); // DELIVERY | DIRECT
  const disabledAdd = addresses.length >= MAX;

  const handleSelect = (addressId) => {
    setSelectedId(addressId);
  };

  const handleConfirm = () => {
    if (!selectedId) {
      alert("선택한 배송지가 없습니다.");
      return;
    }

    const next = new URLSearchParams(searchParams);
    next.set("addressId", selectedId);
    const search = next.toString();

    navigate({
      pathname: `/purchase/${productId}/payment`,
      search: search ? `?${search}` : "",
    });
  };

  useEffect(() => {
    setHeader({
      rightActions: [
        {
          key: "edit-address",
          label: "수정",
          onClick: () => {
            if (!selectedId) {
              alert("수정할 배송지를 선택해주세요.");
              return;
            }
            navigate(`${selectedId}/edit`);
          },
        },
      ],
    });

    return () => {
      resetHeader();
    };
  }, [selectedId, navigate, setHeader, resetHeader]);

  useEffect(() => {
    getMyAddresses().then((data) => {
      setAddresses(data);
      const defaultAddress = data.find((a) => a.isDefault);
      if (defaultAddress) {
        setSelectedId(defaultAddress.addressId);
      }
    });
  }, []);

  return (
    <Container>
      <header className="p-4 font-semibold">배송지 관리</header>

      <div className="px-4 text-sm text-gray-500 mb-3">
        {addresses.length === 0 && (
          <>
            등록된 배송지 정보가 없습니다.
            <br />
          </>
        )}
        배송지는 최대 5개까지 등록할 수 있습니다.
      </div>

      <div className="px-4 mb-4">
        <button
          onClick={() => {
            if (disabledAdd) {
              alert("배송지는 최대 5개까지 등록할 수 있습니다.");
              return;
            }
            navigate(`new`);
          }}
          className={`w-full border rounded-lg py-3 text-sm ${
            disabledAdd ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
          }`}
          disabled={disabledAdd}
        >
          + 배송지 추가
        </button>
      </div>

      <div className="px-4 space-y-3 pb-20">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.addressId}
            address={addr}
            selected={selectedId === addr.addressId}
            onClick={() => handleSelect(addr.addressId)}
          />
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex justify-center">
        <button
          className="w-full bg-green-700 text-white py-3 rounded-lg max-w-[600px]"
          disabled={!selectedId}
          onClick={handleConfirm}
        >
          선택
        </button>
      </div>
    </Container>
  );
};

export default AddressListPage;
