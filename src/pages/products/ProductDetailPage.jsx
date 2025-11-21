import Container from "@/components/Container";

import { Share2 } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const ProductDetailPage = function () {
  return (
    <Container>
      <div>상품상세페이지입니다</div>

      <div className="max-w-sm mx-auto bg-white">
        <div className="flex">
          {/* <div className="flex-grow"></div>{" "} */}
          <ChevronLeft className="flex-grow" /> <Share2 />
        </div>
      </div>
    </Container>
  );
};
export default ProductDetailPage;
