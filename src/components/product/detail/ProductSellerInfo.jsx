import { UserRound, Heart, Eye, Smile } from "lucide-react";
import { Link } from "react-router-dom";

const ProductSellerInfo = ({ detail }) => {
  // const profileImage = detail.seller?.profileImage;
  // const sellerId = detail.seller?.sellerId;
  const {
    profileImage,
    sellerId,
    sellerNickName,
    trustScore: rawScore,
  } = detail.seller || {};

  const formatCount = (num) => {
    if (num < 1000) return num.toString();
    if (num < 1000000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  };

  const viewCount = formatCount(detail.viewCount);
  const wishCount = formatCount(detail.wishCount);

  const trustScore = !rawScore || rawScore === 0 ? "0" : rawScore.toFixed(1);

  return (
    <div className="max-w-lg mx-auto py-5 bg-white">
      {/* 판매자 정보 */}
      <div className="flex items-center justify-between mb-1">
        <Link to={`/sellershop/${sellerId}`}>
          <div className="flex items-center gap-3 ">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                profileImage ? "bg-white" : "bg-brand-green"
              }`}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="size-15 text-brand-ivory " />
              )}
            </div>
            <span className="font-semibold text-brand-green text-2xl truncate max-w-[200px] block">
              {/* 가나다라마바사아자차카타파하 */}
              {sellerNickName}
            </span>
          </div>
        </Link>

        {/* 상호작용*/}
        <div className="flex items-center gap-3 px-1">
          {/* 조회수 */}
          <div className="flex flex-col items-center w-8" title="조회수">
            <span className="text-lg font-semibold text-brand-green">
              {viewCount}
            </span>
            <span className="text-sm text-brand-mediumgray">
              <Eye className="size-4" />
            </span>
          </div>

          {/* 관심수 */}
          <div className="flex flex-col items-center w-8" title="찜수">
            <span className="text-lg font-semibold text-brand-green ">
              {wishCount}
            </span>
            <span className="text-sm  text-brand-mediumgray">
              <Heart className="size-4" />
            </span>
          </div>

          {/* 신뢰점수 :) */}
          <div className="flex flex-col items-center  w-8" title="신뢰점수">
            <span className="text-lg font-semibold text-brand-green">
              {trustScore}
            </span>
            <span className=" text-brand-mediumgray">
              <Smile className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductSellerInfo;
