import { ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const ProductImageCarousel = ({ images }) => {
  const sageImages = Array.isArray(images)
    ? images.filter((img) => img && img.imageUrl)
    : [];

  const extendedImages =
    sageImages.length > 0
      ? [
          //무한루프용 클론이미지 생성
          images[images.length - 1],
          ...images,
          images[0],
        ]
      : [];
  const [current, setCurrent] = useState(1);
  const [transition, setTransition] = useState(true);
  const total = images.length;

  // 드래그/스와이프 관련
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e) => {
    if (!isDragging.current) return;
  };

  const handleEnd = (e) => {
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
    setTransition(true);
    setCurrent((c) => c - 1);
  };
  const next = () => {
    setTransition(true);
    setCurrent((c) => c + 1);
  };

  useEffect(() => {
    if (!transition) return;
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
  }, [current]);

  //사진 순서 표기 조정
  const displayIndex =
    current === 0 ? total : current === total + 1 ? 1 : current;

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
            <img
              key={idx}
              src={img.imageUrl}
              // onError={(e) => (e.target.src = "/fallback.png")} //오류발생시 보여줄 fallback 이미지 public 폴더에 첨부예정
              className=" w-full h-full object-cover inline-block"
              draggable={false}
            />
          );
        })}
      </div>
      {/* 이미지 2개부터 좌우 버튼표시 */}
      {total > 1 && (
        <div>
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
