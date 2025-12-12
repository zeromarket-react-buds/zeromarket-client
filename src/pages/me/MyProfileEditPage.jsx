import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfileEditApi } from "@/common/api/profile.api";
import { useEffect, useState } from "react";
import PhoneEditModal from "@/components/profile/PhoneEditModal";
import EmailEditModal from "@/components/profile/EmailEditModal";

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
}

const MyProfileEditPage = () => {
  // 현재 값
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // 모달 열기용
  const [isOpenPhoneModal, setIsOpenPhoneModal] = useState(false);
  const [isOpenEmailModal, setIsOpenEmailModal] = useState(false);

  const fetchMyProfileEdit = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getProfileEditApi();
      console.log("프로필 응답:", data);

      const img = data.profileImage || "";
      const nick = data.nickname || "";
      const phoneNumber = data.phone || "";
      const EmailAddr = data.email || "";

      setProfileImg(img);
      setNickname(nick);
      setPhone(phoneNumber);
      setEmail(EmailAddr);
    } catch (err) {
      console.error("프로필 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 처음 들어왔을 때 한번 호출
  useEffect(() => {
    fetchMyProfileEdit();
  }, []);

  return (
    <div>
      {/* 프로필 영역 */}
      <section className="flex items-center gap-6 mb-10">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-brand-green flex items-center justify-center overflow-hidden">
            {/* 프로필 이미지 */}
            {profileImg ? (
              <img
                src={profileImg}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="text-brand-ivory size-10" />
            )}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col justify-center">
          <p className="font-bold text-lg">{nickname}</p>
        </div>
      </section>

      {/* 내 정보 */}
      <section className="mb-10">
        <h2 className="mb-3 text-base">내 정보</h2>

        <div className="border rounded-2xl p-5 flex flex-col gap-6">
          {/* 휴대폰 번호 */}
          <div className="flex justify-between items-center">
            <div>
              <p className=" text-brand-mediumgray">휴대폰 번호</p>
              <p className="font-semibold mt-1">{formatPhone(phone)}</p>
            </div>

            <Button
              variant="green"
              className="px-4 py-1 text-sm"
              onClick={() => setIsOpenPhoneModal(true)}
            >
              변경하기
            </Button>
          </div>
          {/*핸드폰 수정 모달*/}
          {isOpenPhoneModal && (
            <PhoneEditModal onClose={() => setIsOpenPhoneModal(false)} />
          )}

          {/* 이메일 */}
          <div className="flex justify-between items-center">
            <div>
              <p className=" text-brand-mediumgray">이메일</p>
              {email ? (
                <p className="font-semibold mt-1">{email}</p>
              ) : (
                <p className="text-brand-mediumgray mt-1">
                  등록된 이메일이 없습니다
                </p>
              )}
            </div>

            <Button
              variant="green"
              className="px-4 py-1 text-sm"
              onClick={() => setIsOpenEmailModal(true)}
            >
              {email ? "변경하기" : "등록하기"}
            </Button>
          </div>
        </div>
        {/*이메일 수정 모달*/}
        {isOpenEmailModal && (
          <EmailEditModal onClose={() => setIsOpenEmailModal(false)} />
        )}
      </section>

      {/* 계정 관리 */}
      <section>
        <h2 className="mb-3 text-base">계정 관리</h2>

        <div className="border rounded-2xl p-5 flex flex-col gap-6">
          {/* 카카오 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2111/2111496.png"
                alt="kakao"
                className="w-8 h-8 rounded"
              />
              <p className="font-medium">카카오</p>
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              연동하기
            </Button>
          </div>

          {/* 네이버 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/23/Naver_Logotype.svg"
                alt="naver"
                className="w-8 h-8"
              />
              <p className="font-medium">네이버</p>
            </div>

            <Button variant="green" className="px-4 py-1 text-sm">
              연동하기
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyProfileEditPage;
