function formatPhone(phone = "") {
  if (!phone) {
    return ""; // 핸드폰번호 없을때 방어로직 (실제로 안들어오면 오류로 안 그려짐)
  }

  // 숫자만 추출
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    // 010-1234-5678
    return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }

  if (digits.length === 10) {
    // 010-123-4567
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  return formatPhone;
}

export default formatPhone;
