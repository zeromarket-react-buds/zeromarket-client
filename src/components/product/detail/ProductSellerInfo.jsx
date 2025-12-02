import { UserRound, Heart, Eye, Smile } from "lucide-react";

const ProductSellerInfo = ({ detail }) => {
  return (
    <div className="max-w-lg mx-auto py-5 bg-white">
      {/* 닉네임과 관련 정보 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3 ">
          <div className="w-12 h-12 bg-brand-green rounded-full flex items-center justify-center text-brand-ivory font-semibold">
            <UserRound className="size-15" />
          </div>
          <span className="font-semibold text-brand-green text-2xl">
            {/* 닉네임 */}
            {detail.seller?.sellerNickName}
          </span>
        </div>

        {/* 상호작용*/}
        <div className="flex items-center gap-5 px-1">
          {/* 조회수 */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-brand-green">
              {/* 12 */}
              {detail.viewCount}
            </span>
            <span className="text-sm text-brand-mediumgray">
              <Eye className="size-4" />
            </span>
          </div>

          {/* 관심수 */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-brand-green">
              {detail.wishCount}
            </span>
            <span className="text-sm  text-brand-mediumgray">
              <Heart className="size-4" />
            </span>
          </div>

          {/* 신뢰점수 :) */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold text-brand-green">0</span>
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
