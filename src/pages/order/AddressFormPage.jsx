import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  getAddressDetail,
} from "@/common/api/address.api";
import Container from "@/components/Container";

const Input = ({ label, value, onChange }) => (
  <input
    placeholder={label}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full border rounded-lg px-3 py-2 text-sm"
  />
);

const AddressFormPage = () => {
  const navigate = useNavigate();
  const { addressId } = useParams();

  const mode = addressId ? "edit" : "create";

  const [form, setForm] = useState({
    name: "",
    receiver: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    isDefault: false,
  });

  useEffect(() => {
    if (mode === "edit") {
      getAddressDetail(addressId).then((data) => {
        setForm({
          name: data.name || "",
          receiver: data.receiverName || "",
          phone: data.receiverPhone || "",
          zipcode: data.zipcode || "",
          address: data.addrBase || "",
          detailAddress: data.addrDetail || "",
          isDefault: Boolean(data.isDefault),
        });
      });
    }
  }, [mode, addressId]);

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        let fullAddress = data.address;

        if (data.buildingName && data.apartment === "Y") {
          fullAddress += ` (${data.buildingName})`;
        }

        setForm((prev) => ({
          ...prev,
          address: fullAddress,
          zipcode: data.zonecode,
        }));
      },
    }).open();
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      receiverName: form.receiver,
      receiverPhone: form.phone,
      zipcode: form.zipcode,
      addrBase: form.address,
      addrDetail: form.detailAddress,
      isDefault: form.isDefault,
    };

    try {
      if (mode === "create") {
        await createAddress(payload);
      } else {
        await updateAddress(addressId, payload);
      }
    } catch (err) {
      console.error(err);
    }

    navigate(-1);
  };

  const handleDelete = async () => {
    await deleteAddress(addressId);
    navigate(-1);
  };

  return (
    <Container>
      <header className="p-4 font-semibold">
        {mode === "create" ? "배송지 추가" : "배송지 수정"}
      </header>

      <div className="p-4 space-y-3 pb-24">
        <Input
          label="배송지명"
          value={form.name}
          onChange={(v) => handleChange("name", v)}
        />
        <Input
          label="받는 분"
          value={form.receiver}
          onChange={(v) => handleChange("receiver", v)}
        />
        <Input
          label="연락처"
          value={form.phone}
          onChange={(v) => handleChange("phone", v)}
        />

        <div className="flex gap-2">
          <input
            value={form.zipcode}
            readOnly
            placeholder="우편번호"
            className="w-1/3 border rounded-lg px-3 py-2 text-sm bg-gray-50"
          />
          <button
            type="button"
            onClick={openAddressSearch}
            className="w-2/3 border rounded-lg text-sm"
          >
            주소 검색
          </button>
        </div>

        <input
          value={form.address}
          readOnly
          placeholder="주소"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
        />

        <Input
          label="상세 주소"
          value={form.detailAddress}
          onChange={(v) => handleChange("detailAddress", v)}
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => handleChange("isDefault", e.target.checked)}
          />
          기본 배송지로 설정
        </label>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-2 justify-center">
        {mode === "edit" && (
          <button onClick={handleDelete} className="w-1/2 border py-3 rounded-lg">
            삭제
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`${mode === "edit" ? "w-1/2" : "w-full"} bg-green-700 text-white py-3 rounded-lg`}
        >
          {mode === "create" ? "등록" : "수정"}
        </button>
      </div>
    </Container>
  );
};

export default AddressFormPage;
