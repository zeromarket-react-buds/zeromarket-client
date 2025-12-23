import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { productAiDraftApi } from "@/common/api/product.api";

// 대표이미지(mainImage)가 바뀌면 vision/aiDraft가 다시 돌 수 있게 구성
// vision 호출 자체는 외부 컴포넌트(브릿지)가 수행하고 결과만 이 훅으로 주입
export default function useProductVisionAi({ images, form, setForm }) {
  // vision / 환경점수 관련
  const [vision, setVision] = useState({ caption: "", tags: [] });
  const [envScore, setEnvScore] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState("");

  // ai 초안 관련
  const aiWriteEnabled = Boolean(form?.aiWriteEnabled);

  /* AI 자동작성 사용 여부를 변경하는 함수
    true/false 값을 직접 넘기거나 이전 값을 받아 다음 값을 계산하는 함수(prev => next)도 받을 수 있음 */
  const setAiWriteEnabled = useCallback(
    (next) => {
      setForm((prev) => {
        // 이전 aiWriteEnabled 값을 boolean으로 정리
        const prevVal = Boolean(prev?.aiWriteEnabled);

        let nextVal;

        // next가 함수면 이전 값을 넘겨서 다음 값을 계산
        if (typeof next === "function") {
          nextVal = next(prevVal);
        } else {
          // 함수가 아니면 값으로 그대로 사용
          nextVal = next;
        }

        return {
          ...prev,
          // 최종적으로 boolean으로 통일
          aiWriteEnabled: Boolean(nextVal),
        };
      });
    },
    [setForm]
  );

  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiDraftError, setAiDraftError] = useState("");
  const [aiDraftDone, setAiDraftDone] = useState(false);

  // 최신 form을 effect에서 안전하게 읽기 위한 ref
  const formRef = useRef(form);
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  // 대표이미지 1장 기준
  const mainImage = useMemo(() => {
    if (!images || images.length === 0) return null;
    return images.find((i) => i.isMain) ?? images[0];
  }, [images]);

  // 대표이미지 기준으로 자동입력 1회만 하도록 키 저장
  const autoFilledKeyRef = useRef("");

  // vision 결과 저장 + 환경점수 세팅
  const handleVisionResult = useCallback(
    (v) => {
      const nextVision = v ?? { caption: "", tags: [] }; // v가 null이나 undefined일 경우 대비

      setVision({
        caption: nextVision.caption ?? "",
        tags: Array.isArray(nextVision.tags) ? nextVision.tags : [],
      });

      const nextScore = nextVision.environmentScore ?? null;

      setEnvScore(nextScore);

      // Create에서 EcoScoreSection이 form.environmentScore를 보고 있으니 form에도 동기화
      setForm((prev) => ({
        ...prev,
        environmentScore: nextScore,
      }));

      setVisionError("");
      setVisionLoading(false);

      // 대표이미지가 바뀌어 새 vision이 들어오면, draft 상태는 다시 초기화해서 재실행 가능하게
      setAiDraftLoading(false);
      setAiDraftError("");
      setAiDraftDone(false);
      autoFilledKeyRef.current = "";
    },
    [setForm]
  );

  // 이미지 제거/변경시 vision/ai 상태 초기화
  const handleVisionReset = useCallback(() => {
    setVision({ caption: "", tags: [] });
    setEnvScore(null);
    setVisionError("");
    setVisionLoading(false);

    setAiDraftLoading(false);
    setAiDraftError("");
    setAiDraftDone(false);
    autoFilledKeyRef.current = "";
  }, []);

  // ProductVisionBridge 호환: onLoading(boolean)
  const handleVisionLoading = useCallback((next) => {
    const flag = Boolean(next);
    setVisionLoading(flag);

    if (flag) {
      // 브릿지가 분석 시작 시점에 true를 던지므로, 이 타이밍에 에러/완료 상태 정리
      setVisionError("");
      setAiDraftDone(false);
    }
  }, []);

  // ProductVisionBridge 호환: onError(string)
  // 브릿지가 ""를 넣어 에러를 지우는 패턴이 있으니, 빈 문자열은 "지우기"로 처리
  const handleVisionError = useCallback((message) => {
    if (message === "") {
      setVisionError("");
      return;
    }

    setVisionLoading(false);
    setVisionError(message || "Vision 분석 실패");
  }, []);

  // aiDraft 호출: 대표이미지(file) + vision 결과가 준비되면 자동 작성
  useEffect(() => {
    // ai 토글 안켜면 호출x
    if (!aiWriteEnabled) return;

    const file = mainImage?.file;

    // 대표이미지 없으면 draft 불가
    if (!file) return;

    // vision 결과가 없으면 draft 불가
    const hasVision =
      (vision?.caption && vision.caption.trim()) ||
      (Array.isArray(vision?.tags) && vision.tags.length > 0);
    if (!hasVision) return;

    // 대표이미지 기준 key
    const fileKey = [file.name, file.size, file.lastModified].join("|");

    // 이미 같은 대표이미지에 대해 자동입력을 한 번 수행했으면 중단
    if (autoFilledKeyRef.current === fileKey) return;

    // 사용자 입력 덮어쓰기 방지: 둘 다 이미 있으면 자동 작성 안 함
    const titleEmpty = !formRef.current.productTitle?.trim();
    const descEmpty = !formRef.current.productDescription?.trim();

    if (!titleEmpty && !descEmpty) {
      autoFilledKeyRef.current = fileKey; // 다음에 또 호출되는 것 방지
      return;
    }

    let cancelled = false;

    const run = async () => {
      try {
        setAiDraftLoading(true);
        setAiDraftError("");
        setAiDraftDone(false);

        const payload = {
          caption: vision.caption ?? "",
          tags: Array.isArray(vision.tags) ? vision.tags : [],
          sellPrice: formRef.current.sellPrice
            ? Number(formRef.current.sellPrice)
            : null,
        };

        const draft = await productAiDraftApi(payload); // { title, description }

        if (cancelled) return;

        const nextTitle = draft?.title;
        const nextDesc = draft?.description;

        setForm((prev) => ({
          ...prev,
          productTitle: prev.productTitle?.trim()
            ? prev.productTitle
            : nextTitle ?? prev.productTitle,
          productDescription: prev.productDescription?.trim()
            ? prev.productDescription
            : nextDesc ?? prev.productDescription,
        }));

        autoFilledKeyRef.current = fileKey; //AI 자동완성이 이미 이 이미지에 대해 한 번 실행되었는지를 기억하기 위한 부분
        setAiDraftDone(true);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setAiDraftError("AI 자동 작성 중 오류가 발생했습니다.");
      } finally {
        if (cancelled) return;
        setAiDraftLoading(false);
      }
    };

    run(); // 조건이 맞으면 AI 초안 생성 작업을 한 번 실행

    return () => {
      cancelled = true;
    };
  }, [
    aiWriteEnabled,
    mainImage?.file,
    vision.caption,
    vision.tags?.length, // tags는 참조가 바뀌면 effect가 너무 자주 돌 수 있으니 길이 정도만 의존성으로
    setForm,
  ]);

  return {
    mainImage,

    vision,
    envScore,
    visionLoading,
    visionError,

    aiWriteEnabled,
    setAiWriteEnabled,
    aiDraftLoading,
    aiDraftError,
    aiDraftDone,

    handleVisionResult,
    handleVisionReset,

    // 브릿지 호환용
    handleVisionLoading,
    handleVisionError,
  };
}
