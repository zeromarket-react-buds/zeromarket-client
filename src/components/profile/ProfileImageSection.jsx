import { Camera, UserRound, XCircle } from "lucide-react";

const ProfileImageSection = ({
  profileImg,
  fileInputRef,
  onChange,
  setProfileImg,
}) => {
  return (
    <section className="flex flex-col items-center mb-10">
      <div className="relative">
        <div
          className={
            profileImg
              ? "w-32 h-32 rounded-full overflow-hidden bg-white" // 이미지 있을 때 (투명사진 대비용)
              : "w-32 h-32 rounded-full bg-brand-green flex items-center justify-center overflow-hidden" // 이미지 없을 때
          }
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

        <button
          className="absolute bottom-2 right-1 w-10 h-10 bg-brand-ivory border border-brand-green rounded-full flex items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
        >
          <Camera size={26} className="text-brand-green" />
        </button>
        <button
          className="absolute -top-1 -right-2 rounded-full flex items-center justify-center"
          onClick={() => setProfileImg(null)}
        >
          <XCircle size={18} className="text-brand-mediumgray" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={onChange}
        />
      </div>
    </section>
  );
};

export default ProfileImageSection;
