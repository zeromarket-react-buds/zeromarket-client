import { useEffect, useRef } from "react";
import { productVisionApi } from "@/common/api/product.api";

const ProductVisionBridge = ({
  file,
  onLoading,
  onResult,
  onError,
  onReset,
}) => {
  // 같은 파일로 중복 호출 방지
  const lastKeyRef = useRef("");

  // 최신 콜백 보관 (의존성 배열에 콜백 넣지 않기 위함)
  const onLoadingRef = useRef(onLoading);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onResetRef = useRef(onReset);

  // 렌더링 때마다 최신 콜백을 ref에 갱신 (effect 트리거는 file 변경만으로 제한)
  useEffect(() => {
    onLoadingRef.current = onLoading;
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    onResetRef.current = onReset;
  }, [onLoading, onResult, onError, onReset]);

  useEffect(() => {
    const run = async () => {
      // 파일이 없으면(이미지 삭제/초기 상태) 관련 UI 상태 초기화
      if (!file) {
        lastKeyRef.current = "";
        onResetRef.current?.(); // 함수가 있을 때만 실행
        return;
      }

      // 같은 파일인지 판별용 key 생성
      const key = [file.name, file.size, file.lastModified].join("|");
      // 이전에 분석했던 파일과 같은 파일이면 Vision API 다시 호출하지 않음
      if (lastKeyRef.current === key) return;
      lastKeyRef.current = key;

      try {
        onLoadingRef.current?.(true);
        onErrorRef.current?.("");

        const data = await productVisionApi(file);

        onResultRef.current?.({
          caption: data?.caption ?? "",
          tags: Array.isArray(data?.tags) ? data.tags : [],
          environmentScore: data?.environmentScore ?? null,
        });
      } catch (e) {
        console.error(e);
        onResultRef.current?.({ caption: "", tags: [] });
        onErrorRef.current?.("이미지 분석 중 오류가 발생했습니다.");
      } finally {
        onLoadingRef.current?.(false);
      }
    };

    run();
  }, [file]);

  return null;
};

export default ProductVisionBridge;
