import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";

export default function MyProfile() {
  const navigate = useNavigate();
  const { setHeader } = useHeader();

  const [previewImg, setPreviewImg] = useState(null);
  const [profileFile, setProfileFile] = useState(null); // 실제 파일 저장
  const [nickname, setNickname] = useState("현재 닉네임");
  const [intro, setIntro] = useState("현재 한줄 소개");

  const fileInputRef = useRef(null);

  // 저장 처리
  const handleSave = useCallback(async () => {
    const formData = new FormData();
    if (profileFile) formData.append("profileImage", profileFile);
    formData.append("nickname", nickname);
    formData.append("intro", intro);

    // 실제 저장 API 연동 코드 자리
    // await apiClient("/api/me/profile", {
    //   method: "POST",
    //   body: formData,
    // });

    alert("프로필이 저장되었습니다!");
    navigate("/me"); // 마이페이지로 이동
  }, [profileFile, nickname, intro, navigate]);

  // 페이지 진입 시 헤더 설정
  useEffect(() => {
    setHeader({
      title: "프로필 설정",
      titleAlign: "left", // 필요에 따라 left/center
      showBack: true,
      hideRight: false,
      rightActions: [
        {
          key: "save",
          label: "완료",
          onClick: handleSave,
          className: "text-brand-green font-semibold text-sm",
        },
      ],
    });
  }, [handleSave]);

  // 프로필 이미지 업로드 처리
  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImg(imageUrl);
    setProfileFile(file);
  };

  return (
    <div className="w-full max-w-md mx-auto p-5">
      {/* 헤더는 RootLayout + TitleHeader에서 렌더링됨 */}

      {/* 프로필 이미지 */}
      <section className="flex flex-col items-center mb-10">
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full bg-brand-green flex items-center justify-center overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {!previewImg ? (
              <UserRound className="text-brand-ivory size-25" />
            ) : (
              <img
                src={previewImg}
                alt="profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* 카메라 버튼 */}
          <button
            className="absolute bottom-2 right-1 w-8 h-8 bg-brand-ivory border border-brand-green rounded-full flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={18} className="text-brand-green" />
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleProfileChange}
          />
        </div>
      </section>

      {/* 닉네임 입력 */}
      <div className="mb-6">
        <label className="block mb-2 text-sm">닉네임</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border border-brand-green rounded-md py-2 px-3 text-sm"
        />
      </div>

      {/* 한줄 소개 입력 */}
      <div>
        <label className="block mb-2 text-sm">한줄 소개</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          className="w-full border border-brand-green rounded-md py-2 px-3 text-sm resize-none"
        />
      </div>
    </div>
  );
}
