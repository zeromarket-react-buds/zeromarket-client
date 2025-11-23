import { ChevronLeft, Share2 } from "lucide-react";

const DetailStickyHeader = () => {
  return (
    <div className="flex justify-between items-center px-2 py-2">
      {/* 뒤로가기 */}
      <ChevronLeft className="p-0.3 text-gray-800" />
      {/* 공유하기 */}
      <Share2 className="m-2 mr-3 text-gray-800" />
    </div>
  );
};

export default DetailStickyHeader;
