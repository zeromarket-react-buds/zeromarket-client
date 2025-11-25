import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CategorySelector = () => {
  const [selectedCategories, setSelectedCategories] = useState({
    category1: "",
    category2: "",
    category3: "",
  });

  const categories = [
    {
      id: 1,
      options: ["1차 카테고리", "디지털", "의류"],
      placeholder: "1차 카테고리",
    },
    {
      id: 2,
      options: ["2차 카테고리", "서브카테고리1", "서브카테고리2"],
      placeholder: "2차 카테고리",
    },
    {
      id: 3,
      options: ["3차 카테고리", "세부1", "세부2"],
      placeholder: "3차 카테고리",
    },
  ];

  return (
    <div className="mt-5">
      <p className="font-medium mb-2 text-lg">카테고리</p>
      {categories.map((item, idx) => (
        <div className="relative w-full mb-3">
          <select
            className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm"
            value={selectedCategories[`c${item.id}`]}
            onChange={(e) =>
              setSelectedCategories((prev) => ({
                ...prev,
                [`category${item.id}`]: e.target.value,
              }))
            }
          >
            {item.options.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-6 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
      ))}
    </div>
  );
};
export default CategorySelector;
