import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import {
  fetchLevel1Categories,
  fetchLevel2Categories,
  fetchLevel3Categories,
} from "@/common/api/product.api";

const CategorySelector = ({ value, onChange, showTitle = true }) => {
  const [level1, setLevel1] = useState([]);
  const [level2, setLevel2] = useState([]);
  const [level3, setLevel3] = useState([]);
  const [initializedFromValue, setInitializedFromValue] = useState(false); // 로그인된 사용자의 JWT 토큰을 헤더에 추가하는 함수

  const { user, isAuthenticated, loading: isAuthLoading } = useAuth(); // 로그인 토큰 가져오기 // 이미 세팅된 value로부터 labels를 초기화했는지 여부

  // Level 1 데이터 로딩
  useEffect(() => {
    // 인증 초기화(AuthContext의 loading) 중이면 API 요청을 건너뛰고 대기
    if (isAuthLoading) {
      console.log("인증 초기화 중, Level 1 API 요청 대기...");
      return;
    }

    fetchLevel1Categories()
      .then((data) => setLevel1(data))
      .catch((err) => {
        console.error("Level 1 카테고리 로딩 실패:", err);
        setLevel1([]);
      });
  }, [isAuthLoading, isAuthenticated]);

  // Level 2 데이터 로딩
  useEffect(() => {
    if (isAuthLoading) return;
    if (!value.depth1) {
      setLevel2([]);
      setLevel3([]);
      return;
    }

    fetchLevel2Categories(value.depth1)
      .then((data) => setLevel2(data))
      .catch((err) => {
        console.error("Level 2 카테고리 로딩 실패:", err);
        setLevel2([]);
      });
  }, [value.depth1, isAuthLoading]);

  // Level 3 데이터 로딩
  useEffect(() => {
    if (isAuthLoading) return;
    if (!value.depth2) {
      setLevel3([]);
      return;
    }

    fetchLevel3Categories(value.depth2)
      .then((data) => setLevel3(data))
      .catch((err) => {
        console.error("Level 3 카테고리 로딩 실패:", err);
        setLevel3([]); // 실패 시 빈 배열 설정
      });
  }, [value.depth2, isAuthLoading]);

  // value에서 받은 depth1, depth2, depth3으로 초기화
  useEffect(() => {
    if (initializedFromValue) return;

    if (!value.depth1 || !value.depth2 || !value.depth3) return;
    if (!level1.length || !level2.length || !level3.length) return;

    const l1 = level1.find((category) => category.id === value.depth1) || null;
    const l2 = level2.find((category) => category.id === value.depth2) || null;
    const l3 = level3.find((category) => category.id === value.depth3) || null;

    if (!l3) return;

    const labels = {
      level1Name: l1?.name ?? null,
      level2Name: l2?.name ?? null,
      level3Name: l3?.name ?? null,
    };

    onChange(value.depth1, value.depth2, value.depth3, labels);
    setInitializedFromValue(true);
  }, [
    initializedFromValue,
    value.depth1,
    value.depth2,
    value.depth3,
    level1,
    level2,
    level3,
    onChange,
  ]);

  // level1, level2, level3 선택 핸들러
  const handleLevel1 = (id) => {
    const selected = level1.find((category) => category.id === id) || null;

    const labels = {
      level1Name: selected?.name ?? null,
      level2Name: null,
      level3Name: null,
    };

    onChange(id || null, null, null, labels);
    setLevel2([]);
    setLevel3([]);
  };

  const handleLevel2 = (id) => {
    const selected = level2.find((category) => category.id === id) || null;

    const labels = {
      level1Name:
        level1.find((category) => category.id === value.depth1)?.name ?? null,
      level2Name: selected?.name ?? null,
      level3Name: null,
    };

    onChange(value.depth1, id || null, null, labels);
    setLevel3([]);
  };

  const handleLevel3 = (id) => {
    const selected = level3.find((category) => category.id === id) || null;

    const labels = {
      level1Name:
        level1.find((category) => category.id === value.depth1)?.name ?? null,
      level2Name:
        level2.find((category) => category.id === value.depth2)?.name ?? null,
      level3Name: selected?.name ?? null,
    };

    onChange(value.depth1, value.depth2, id || null, labels);
  };

  return (
    <div className="mt-5">
      {showTitle && <p className="font-medium mb-2 text-lg">카테고리</p>}
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
    </div>
  );
};
export default CategorySelector;
