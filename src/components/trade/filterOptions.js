// 재사용 가능한 상태 옵션
export const statusOptions = [
  { label: "예약중", value: "PENDING" },
  { label: "거래완료", value: "COMPLETED" },
  { label: "거래취소", value: "CANCELED" },
  { label: "숨기기", value: "isHidden" },
];

// value를 label 매핑
export const statusLabelByValue = statusOptions.reduce((acc, current) => {
  acc[current.value] = current.label;
  return acc;
}, {});

// 상태 라벨
export const getStatusLabel = (value) => {
  return statusLabelByValue[value] ?? value;
};

// 날짜 포맷
const internalFormatDate = (value) => {
  if (!value) return "";

  if (typeof value === "string" && value.includes("T")) {
    const [y, m, d] = value.split("T")[0].split("-");
    return `${y}.${m}.${d}`;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  return `${y}.${m}.${d}`;
};

// 기간 라벨
export const getPeriodLabel = (from, to) => {
  const fromLabel = from ? internalFormatDate(from) : "시작일 설정 없음";
  const toLabel = to ? internalFormatDate(to) : "종료일 설정 없음";
  return `${fromLabel} ~ ${toLabel}`;
};
