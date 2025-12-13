import { useEffect, useMemo, useRef, useState } from "react";
import { productVisionApi } from "@/common/api/product.api";

const EcoScoreSection = ({ images = [] }) => {
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // images가 바뀔 때만 다시 계산하고, 그 외에는 이전 결과를 재사용
  const mainImage = useMemo(() => {
    if (!images || images.length === 0) return null; // 이미지 비어 있을 때
    return images.find((i) => i.isMain) ?? images[0]; // 이미지 있을 때 isMain 있으면 그걸로, 아니면 첫번째
  }, [images]);

  // 같은 파일로 중복 호출 방지
  const lastKeyRef = useRef("");

  useEffect(() => {
    const run = async () => {
      // 이미지 없으면 상태 초기화
      if (!mainImage?.file) {
        setCaption("");
        setTags([]);
        setError("");
        setLoading(false);
        lastKeyRef.current = "";
        return;
      }

      // 같은 파일인지 판별용 key 생성
      const key = [
        mainImage.file.name,
        mainImage.file.size,
        mainImage.file.lastModified,
      ].join("|");

      // 이전에 분석했던 파일과 같은 파일이면 Vision API 다시 호출하지 않음
      if (lastKeyRef.current === key) return;
      lastKeyRef.current = key;

      try {
        setLoading(true);
        setError("");

        const data = await productVisionApi(mainImage.file);

        setCaption(data.caption ?? "");
        setTags(Array.isArray(data.tags) ? data.tags : []);
      } catch (e) {
        console.error(e);
        setCaption("");
        setTags([]);
        setError("이미지 분석 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [mainImage]);

  return (
    <div className="mt-8 mb-20">
      <p className="font-bold py-3 border-b text-lg">환경 점수</p>

      <div className="bg-brand-green text-white w-full p-3 py-3 my-5 rounded-lg text-md font-white">
        <div className="flex justify-between mb-3">
          <span>환경점수</span>
          <span>100p</span>
        </div>
        <div className="flex justify-between">
          <span>Vision 분석</span>
          <span>{loading ? "분석중" : caption ? "완료" : "대기"}</span>
        </div>

        {caption && (
          <div className="mt-2 text-sm opacity-95">
            <div className="font-semibold">캡션</div>
            <div className="mt-1">{caption}</div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-2 text-sm opacity-95">
            <div className="font-semibold">태그</div>
            <div className="mt-1">{tags.slice(0, 5).join(", ")}</div>
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default EcoScoreSection;
