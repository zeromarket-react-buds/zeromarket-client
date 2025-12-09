import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";
import { getProfileApi, updateProfileApi } from "@/common/api/user.api";
import { useProfileToast } from "@/components/GlobalToast";
import { uploadToSupabase } from "@/lib/supabaseUpload";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { showProfileUpdatedToast } = useProfileToast();
  const { setHeader } = useHeader();

  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);
  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

  const fileInputRef = useRef(null);

  const fetchMyProfileSetting = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getProfileApi();
      console.log("프로필 응답:", data);

      setProfileImg(data.profileImage || "");
      setNickname(data.nickname || "");
      setIntro(data.introduction || "");
    } catch (err) {
      console.error("프로필 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  // 처음 들어왔을 때 한번 호출
  useEffect(() => {
    fetchMyProfileSetting();
  }, []);

  // 저장 처리: JSON 형태로 서버에 전송
  const handleSave = useCallback(async () => {
    try {
      await updateProfileApi({
        profileImage: profileImg,
        nickname,
        introduction: intro,
      });

      showProfileUpdatedToast();
      navigate("/me");
    } catch (err) {
      console.error("프로필 수정 실패:", err);
    }
  }, [profileImg, nickname, intro, navigate]);

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
  }, [setHeader, handleSave]);

  // 프로필 이미지 업로드 처리
  const handleProfileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      alert("이미지 파일(JPG, JPEG, PNG, WebP)만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    try {
      // 파일 업로드 후 Supabase public URL 확보
      const publicUrl = await uploadToSupabase(file);

      // 화면 상태에 반영
      setProfileImg(publicUrl);
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      alert("프로필 이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
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
            {!profileImg ? (
              <UserRound className="text-brand-ivory size-25" />
            ) : (
              <img
                src={profileImg}
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
            <Camera size={20} className="text-brand-green" />
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
        <label className="block mb-3 pl-1 text-base">닉네임</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full border border-brand-green rounded-xl py-2 px-5 text-base"
        />
      </div>

      {/* 한줄 소개 입력 */}
      <div>
        <label className="block mb-3 pl-1 text-base">한줄 소개</label>
        <textarea
          value={intro ?? ""}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          className="w-full border border-brand-green rounded-xl py-2 px-5 text-base resize-none"
        />
      </div>
    </div>
  );
};

export default MyProfilePage;
