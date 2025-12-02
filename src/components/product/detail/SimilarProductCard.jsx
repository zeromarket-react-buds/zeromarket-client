import { Heart } from "lucide-react";
import { useLikeToast } from "@/components/GlobalToast";

const SimilarProductCard = () => {
  const { showLikeToast } = useLikeToast();
  // //   토스트 알림
  // const handleLikeClick = () => {
  //   toast.success("찜 목록에 추가되었어요!", {
  //     position: "bottom-center",
  //     autoClose: 3000,
  //     hideProgressBar: true,
  //     pauseOnHover: false,
  //   });
  // };
  return (
    <div className="">
      {/* 상품 카드 1 */}
      <div className=" bg-gray-0 p-1 pb-2">
        <div className="relative">
          <div className="bg-gray-200 h-36 rounded-lg ">
            {/* 상품 이미지 */}
          </div>

          <div className="flex justify-between items-center px-2 py-2 absolute bottom-0  w-full">
            <div className="text-xs text-white  border-black rounded-md bg-brand-green p-1 px-3">
              예약중
            </div>

            <Heart className="size-6 mx-1" onClick={showLikeToast} />
          </div>
        </div>
        <div className="p-1">
          <div className="text-sm text-brand-darkgray">
            실제로 들어갈 상품제목
          </div>
          <div className="text-sm font-semibold">0,000원</div>
          <div className="text-xs text-brand-mediumgray">20분 전</div>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
