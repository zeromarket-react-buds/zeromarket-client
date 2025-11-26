import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const CategorySelector = ({ value, onChange }) => {
  const [level1, setLevel1] = useState([]);
  const [level2, setLevel2] = useState([]);
  const [level3, setLevel3] = useState([]);

  useEffect(() => {
    fetch("/api/categories/level1")
      .then((res) => res.json())
      .then(setLevel1);
  }, []);

  const handleLevel1 = (id) => {
    onChange(id, null, null); //부모에게 전달ㄹ
    setLevel2([]);
    setLevel3([]);

    if (!id) return;

    fetch(`/api/categories/level2?parentId=${id}`)
      .then((res) => res.json())
      .then(setLevel2);
  };

  const handleLevel2 = (id) => {
    onChange(value.depth1, id, null);
    setLevel3([]);

    if (!id) return;

    fetch(`/api/categories/level3?parentId=${id}`)
      .then((res) => res.json())
      .then(setLevel3);
  };

  const handleLevel3 = (id) => {
    onChange(value.depth1, value.depth2, id);
  };

  // const handleDepth1 = (id) => onChange(id, null, null);
  // const handleDepth2 = (id) => onChange(value.depth1, id, null);
  // const handleDepth3 = (id) => onChange(value.depth1, value.depth2, id);

  // const [selectedCategories, setSelectedCategories] = useState({
  //   category1: "",
  //   category2: "",
  //   category3: "",
  // });

  // const categories = [
  //   {
  //     id: 1,
  //     options: ["1차 카테고리", "디지털", "의류"],
  //     placeholder: "1차 카테고리",
  //   },
  //   {
  //     id: 2,
  //     options: ["2차 카테고리", "서브카테고리1", "서브카테고리2"],
  //     placeholder: "2차 카테고리",
  //   },
  //   {
  //     id: 3,
  //     options: ["3차 카테고리", "세부1", "세부2"],
  //     placeholder: "3차 카테고리",
  //   },
  // ];

  return (
    <div className="mt-5">
      <p className="font-medium mb-2 text-lg">카테고리</p>

      {/* 1차 카테고리 */}
      <div className="relative w-full mb-3 ">
        <select
          className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm cursor-pointer"
          value={value.depth1 || ""}
          onChange={(e) => handleLevel1(Number(e.target.value))}
        >
          <option value="">1차 카테고리 선택</option>
          {level1.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-6 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* 2차 카테고리 */}
      <div className="relative w-full mb-3 cursor-pointer">
        <select
          className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm cursor-pointer"
          value={value.depth2 || ""}
          onChange={(e) => handleLevel2(Number(e.target.value))}
          disabled={!value.depth1}
        >
          <option value="">2차 카테고리 선택</option>
          {level2.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-6 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* 3차 카테고리 */}
      <div className="relative w-full mb-3 cursor-pointer">
        <select
          className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm cursor-pointer"
          value={value.depth3 || ""}
          onChange={(e) => handleLevel3(Number(e.target.value))}
          disabled={!value.depth2}
        >
          <option value="">3차 카테고리 선택</option>
          {level3.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-6 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>

      {/* {categories.map((item) => (
        <div className="relative w-full mb-3" key={item.id}>
          <select
            className=" w-full border rounded-lg px-3 py-3 appearance-none text-sm"
            value={selectedCategories[`category${item.id}`]}
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
      ))} */}
    </div>
  );
};
export default CategorySelector;
