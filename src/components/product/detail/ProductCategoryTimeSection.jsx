import dayjs from "@/utils/time";
import { useNavigate } from "react-router-dom";

const ProductCategoryTimeSection = ({ detail }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center my-3">
      <span
        className=" text-gray-600 text-base hover:underline flex items-center cursor-pointer"
        onClick={() =>
          navigate(
            `/search?keyword=&sort=popularity` +
              `&level1Id=${detail.level1Id}` +
              `&level2Id=${detail.level2Id}` +
              `&level3Id=${detail.level3Id}` +
              `&categoryName=${detail.categoryDepth3}`
          )
        }
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
