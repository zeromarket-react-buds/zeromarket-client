import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ProductImageCarousel = ({ images, isHidden, salesStatus }) => {
  const validImages = Array.isArray(images)
    ? images.filter((img) => img && img.imageUrl)
    : [];

  const total = validImages.length;

  const isNotForSale = salesStatus?.name == "SOLD_OUT";
  const showOverlay = isHidden || isNotForSale;
  const overlayText = isHidden ? "숨김 처리된 상품" : salesStatus?.description;

  const extendedImages =
    total > 1
      ? [
          //무한루프용 클론이미지 생성
          validImages[total - 1],
          ...validImages,
          validImages[0],
        ]
      : validImages;

  const [current, setCurrent] = useState(total > 1 ? 1 : 0);
  const [transition, setTransition] = useState(true);

  // 드래그/스와이프 관련
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (e) => {
    if (total <= 1) return;
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (total <= 1) return;
    if (!isDragging.current) return;
  };

  const handleEnd = (e) => {
    if (total <= 1) return;
    if (!isDragging.current) return;
    isDragging.current = false;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;

    const diff = endX - startX.current;

    if (Math.abs(diff) > 50) {
      if (diff < 0) next();
      else prev();
    }
  };
  const prev = () => {
    if (total <= 1) return;
    setTransition(true);
    setCurrent((c) => c - 1);
  };
  const next = () => {
    if (total <= 1) return;
    setTransition(true);
    setCurrent((c) => c + 1);
  };

  useEffect(() => {
    if (total <= 1) return;
    // if (!transition) return;

    if (current === total + 1) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(1);
      }, 500);
    }

    if (current === 0) {
      setTimeout(() => {
        setTransition(false);
        setCurrent(total);
      }, 500);
    }
  }, [current, total]);

  //사진 순서 표기 조정
  const displayIndex =
    total <= 1
      ? 1 // 이미지 1장일때 무한루프 끄기
      : current === 0
      ? total
      : current === total + 1
      ? 1
      : current;

  return (
    <div
      className="relative overflow-hidden bg-gray-200 w-full h-90  text-gray-600 select-none group"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {showOverlay && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-black/20 backdrop-blur-[2px] border border-white/30 px-6 py-3 rounded-sm">
            <span className="text-white text-2xl font-bold tracking-tight drop-shadow-lg">
              {overlayText}
            </span>
          </div>
        </div>
      )}
      {/* 이미지 슬라이드, 이미지 에러났을때 뜰 대체이미지 */}
      <div
        className={`whitespace-nowrap h-full ${
          transition ? "transition-transform duration-500" : ""
        }`}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {extendedImages.map((img, idx) => {
          if (!img || !img.imageUrl) return null;
          return (
            <div key={idx} className="relative w-full h-full inline-block ">
              <img
                src={img.imageUrl}
                // onError={(e) => (e.target.src = "/fallback.png")} //오류발생시 보여줄 fallback 이미지 public 폴더에 첨부예정
                className=" w-full h-full object-cover"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      {/* 이미지 2개부터 좌우 버튼표시 */}
      {total > 1 && (
        <div className="z-30">
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 
            text-white size-20 text-4xl cursor-pointer
            opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 "
            onClick={prev}
          >
            <ChevronLeft className="size-15 drop-shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
          </div>
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2
            text-white size-20 text-4xl cursor-pointer 
            opacity-0 group-hover:opacity-100 
              transition-opacity duration-300"
            onClick={next}
          >
            <ChevronRight className="size-15  drop-shadow-[0_0_4px_rgba(0,0,0,0.4)]" />
          </div>

          <div className="absolute bottom-3 right-4 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
            {displayIndex}/{total}
          </div>
        </div>
      )}
      <div
        className="pointer-events-none absolute -top-5 left-0 w-full 
      h-15 bg-gradient-to-b from-black/10 to-transparent 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      ></div>
      <div
        className="pointer-events-none absolute -bottom-5 left-0 w-full 
      h-15 bg-gradient-to-t from-black/10 to-transparent 
      opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      ></div>
    </div>
  );
};
export default ProductImageCarousel;
