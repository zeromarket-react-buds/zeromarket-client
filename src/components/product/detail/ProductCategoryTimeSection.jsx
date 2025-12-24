import dayjs from "@/utils/time";
import { useNavigate } from "react-router-dom";

const ProductCategoryTimeSection = ({ detail }) => {
  const navigate = useNavigate();

  const goCategorySearch = () => {
    const categoryId = detail.level3Id; // 3depth id. URL+서버요청용
    const categoryName = detail.categoryDepth3; // 3depth name. 화면표시용

    navigate(`/search?keyword=&sort=popularity&categoryId=${categoryId}`, {
      state: { categoryName },
    });
  };

  return (
    <div className="flex justify-between items-center my-3">
      <span
        className=" text-gray-600 text-base hover:underline flex items-center cursor-pointer"
        onClick={goCategorySearch}
      >
        <span>{detail.categoryDepth1} </span>
        <span className="text- font-semibold">&nbsp;〉</span>
        <span>{detail.categoryDepth2}</span>
        <span className="text- font-semibold">&nbsp;〉</span>
        <span>{detail.categoryDepth3}</span>
      </span>

      <span className="text-sm text-gray-500">
        {dayjs(detail.createdAt).fromNow()}
      </span>
    </div>
  );
};
export default ProductCategoryTimeSection;
