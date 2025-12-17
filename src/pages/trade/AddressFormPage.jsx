import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Input = ({ label, value, onChange }) => {
  return (
    <input
      placeholder={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-3 py-2 text-sm"
    />
  );
};

const AddressFormPage = ({ mode }) => {
  const navigate = useNavigate();
  const { addressId } = useParams();

  // 우편번호 포함 권장
  const [form, setForm] = useState({
    name: "",
    receiver: "",
    phone: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    isDefault: false,
  });

  /* 수정 모드일 때만 기존 데이터 로드 */
  useEffect(() => {
    if (mode === "edit") {
      // GET /api/addresses/:addressId
      setForm({
        name: "집",
        receiver: "김아무개",
        phone: "010-0000-0000",
        address: "서울시 ...",
        detailAddress: "101동 101호",
        isDefault: true,
      });
    }
  }, [mode, addressId]);

  // 카카오 주소 검색 함수
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 기본 주소
        let fullAddress = data.address;

        // 건물명 처리 (아파트 등)
        if (data.buildingName && data.apartment === "Y") {
          fullAddress += ` (${data.buildingName})`;
        }

        setForm((prev) => ({
          ...prev,
          address: fullAddress,
          zipcode: data.zonecode, // 우편번호
        }));
      },
    }).open();
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (mode === "create") {
      // POST /api/addresses
    } else {
      // PUT /api/addresses/:addressId
    }
    navigate("/addresses");
  };

  const handleDelete = () => {
    // DELETE /api/addresses/:addressId
    navigate("/addresses");
  };

  return (
    <div className="max-w-md mx-auto pb-24">
      <header className="p-4 font-semibold">
        {mode === "create" ? "배송지 추가" : "배송지 편집"}
      </header>

      <div className="p-4 space-y-3">
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
          label="휴대폰 번호"
          value={form.phone}
          onChange={(v) => handleChange("phone", v)}
        />

        {/* 우편번호 + 주소 검색 */}
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

        {/* 기본 주소 */}
        <input
          value={form.address}
          readOnly
          placeholder="주소"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50"
        />

        {/* 상세 주소 */}
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
          대표 배송지로 설정
        </label>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-2">
        {mode === "edit" && (
          <button
            onClick={handleDelete}
            className="w-1/2 border py-3 rounded-lg"
          >
            삭제
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`${
            mode === "edit" ? "w-1/2" : "w-full"
          } bg-green-700 text-white py-3 rounded-lg`}
        >
          {mode === "create" ? "완료" : "편집"}
        </button>
      </div>
    </div>
  );
};

export default AddressFormPage;
