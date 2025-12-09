import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@/hooks/HeaderContext";
import {
  checkNicknameApi,
  getProfileApi,
  updateProfileApi,
} from "@/common/api/user.api";
import { useProfileToast } from "@/components/GlobalToast";
import { uploadToSupabase } from "@/lib/supabaseUpload";
import ProfileImageSection from "@/components/profile/ProfileImageSection";
import NicknameSection from "@/components/profile/NicknameSection";
import IntroSection from "@/components/profile/IntroSection";

// 한글 2, 그 외 1로 계산하는 길이
const getWeightedLength = (str) => {
  let len = 0;

  for (const ch of str) {
    if (/[ㄱ-ㅎ가-힣]/.test(ch)) {
      len += 2; // 한글
    } else {
      len += 1; // 영문, 숫자, 기타
    }
  }

  return len;
};

const MyProfilePage = () => {
  const navigate = useNavigate();
  const { showProfileUpdatedToast } = useProfileToast();
  const { setHeader } = useHeader();

  // 초기값 보관용
  const [initialNickname, setInitialNickname] = useState("");
  const [initialProfileImg, setInitialProfileImg] = useState("");
  const [initialIntro, setInitialIntro] = useState("");

  // 현재 값
  const [nickname, setNickname] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);

  // 입력 최댓값
  const maxNicknameLength = 20;
  const maxIntroLength = 100;

  // 에러
  const [introError, setIntroError] = useState("");
  const [dupError, setDupError] = useState("");
  const [lengthError, setLengthError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // 현재 길이들
  const currentNicknameLength = getWeightedLength(nickname);
  const currentIntroLength = getWeightedLength(intro);

  const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
  const fileInputRef = useRef(null);

  const fetchMyProfileSetting = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getProfileApi();
      console.log("프로필 응답:", data);

      const img = data.profileImage || "";
      const nick = data.nickname || "";
      const introText = data.introduction || "";

      // 초기값
      setInitialProfileImg(img);
      setInitialNickname(nick);
      setInitialIntro(introText);

      // 현재 값
      setProfileImg(img);
      setNickname(nick);
      setIntro(introText);
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

  // 닉네임 입력 시: 값은 그대로, 에러만 갱신
  const handleNicknameChange = (e) => {
    const next = e.target.value;
    const currentLength = getWeightedLength(next);

    if (currentLength > maxNicknameLength) {
      setLengthError(
        "닉네임은 글자당 한글 2, 영문/숫자 1을 기준으로 최대 20자까지 가능합니다."
      );
    } else {
      setLengthError("");
    }

    setNickname(next);
  };

  // 닉네임 중복 체크
  useEffect(() => {
    if (!nickname.trim()) {
      setDupError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsChecking(true);
      try {
        const exists = await checkNicknameApi(nickname);
        if (exists) {
          setDupError("이미 사용 중인 닉네임입니다.");
        } else {
          setDupError("");
        }
      } catch (err) {
        console.error("닉네임 중복 체크 실패:", err);
        setDupError("중복 확인 중 오류가 발생했습니다.");
      } finally {
        setIsChecking(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [nickname]);

  // 한줄 소개 입력
  const handleIntroChange = (e) => {
    const next = e.target.value;
    const currentLength = getWeightedLength(next);

    if (currentLength > maxIntroLength) {
      setIntroError(
        `한줄 소개는 글자당 한글 2, 영문/숫자 1을 기준으로 최대 100자까지 가능합니다.`
      );
    } else {
      setIntroError("");
    }

    setIntro(next);
  };

  // 저장 처리: 글자수/중복만 검증 후 patch
  const handleSave = useCallback(async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setLengthError("닉네임을 입력해주세요.");
      return;
    }

    const nicknameLength = getWeightedLength(trimmed);
    if (nicknameLength > maxNicknameLength) {
      const msg =
        "닉네임은 글자당 한글 2, 영문/숫자 1을 기준으로 최대 20자까지 가능합니다.";
      window.alert(msg + "\n입력 내용을 수정하신 후 다시 저장을 시도해주세요.");
      setLengthError(msg);
      return;
    }

    if (dupError) {
      window.alert("이미 사용 중인 닉네임은 사용할 수 없습니다.");
      return;
    }

    const introLength = getWeightedLength(intro);
    if (introLength > maxIntroLength) {
      window.alert(
        "한줄 소개는 글자당 한글 2, 영문/숫자 1을 기준으로 최대 100자까지 가능합니다.\n입력 내용을 줄여주세요."
      );
      return;
    }

    try {
      setIsSaving(true);
      await updateProfileApi({
        profileImage: profileImg,
        nickname: trimmed,
        introduction: intro,
      });

      // 저장 성공 시 초기값 갱신
      setInitialNickname(trimmed);
      setInitialProfileImg(profileImg);
      setInitialIntro(intro);

      showProfileUpdatedToast();
      navigate("/me");
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      alert("프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSaving(false);
    }
  }, [nickname, dupError, intro, profileImg, navigate]);

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
          className: "font-semibold text-lg",
          disabled: isSaving,
        },
      ],
    });
  }, [setHeader, handleSave, isSaving]);

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
      <ProfileImageSection
        profileImg={profileImg}
        fileInputRef={fileInputRef}
        onChange={handleProfileChange}
      />

      {/* 닉네임 입력 */}
      <NicknameSection
        nickname={nickname}
        onChange={handleNicknameChange}
        lengthError={lengthError}
        dupError={dupError}
        isChecking={isChecking}
        currentLength={currentNicknameLength}
        maxLength={maxNicknameLength}
      />

      {/* 한줄 소개 입력 */}
      <IntroSection
        intro={intro}
        onChange={handleIntroChange}
        introError={introError}
        maxLength={maxIntroLength}
        currentLength={currentIntroLength}
      />
    </div>
  );
};

export default MyProfilePage;
