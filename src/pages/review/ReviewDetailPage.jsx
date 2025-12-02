import { useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";

const ReviewDetailPage = () => {
  const { reviewId } = useParams();
  const location = useLocation();
  const { ratingLabel, content } = location.state || {};

  return (
    <div className="min-h-screen bg-white p-5 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center mb-8">
        <ArrowLeft className="w-6 h-6" />
        <p className="flex-1 text-center font-semibold text-lg">
          내가 보낸 후기
        </p>
      </div>

      <Mail className="w-16 h-16 text-black mb-4" />

      <p className="text-sm text-gray-700">복보님께</p>
      <p className="text-sm text-gray-700 mb-1">거래한 후기 내용입니다</p>

      <p className="font-semibold text-base mb-6">무선 마우스</p>

      <div className="bg-gray-100 p-4 rounded-md w-full max-w-md">
        <p className="font-semibold mb-2">{ratingLabel}</p>
        <hr className="border-gray-300 mb-2" />
        <p>{content}</p>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
