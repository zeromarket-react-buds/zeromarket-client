import { useState, useRef } from "react";
import { Upload, X, CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductImageUploader = ({ images, setImages }) => {
  const fileInputRef = useRef(null);
  // const [mainIndex, setMainIndex] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const validFiles = [];

    for (const file of files) {
      const extension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(extension)) {
        alert("이미지 파일(JPG, JPEG, PNG, WebP)만 업로드할 수 있습니다.");
        continue;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        imageUrl: null, //아직없음
        imageId: null, //신규
      });
    }

    if (validFiles.length === 0) return;

    setImages((prev) => {
      const merged = [...prev, ...validFiles].slice(0, 5);

      //기존 메인index찾기
      const oldMainIndex = prev.findIndex((i) => i.isMain);

      return merged.map((img, idx) => ({
        ...img,
        sortOrder: idx,
        isMain: idx === oldMainIndex,
      }));
    });

    fileInputRef.current.value = "";
  };

  //대표 사진 선택
  const setAsMain = (index) => {
    console.log(`Selected main image index: ${index}`);
    setImages((prev) =>
      prev.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  // 첨부대기중 이미지 삭제
  const removeImage = (index) => {
    setImages((prev) => {
      const wasMain = prev[index].isMain; //삭제된게 대표였는지확인
      const filtered = prev.filter((_, i) => i !== index);
      //sortorder 재정렬

      if (filtered.length === 0) return [];

      // 삭제된 이미지가 대표 이미지였던 경우- 첫 번째 이미지를 새 대표로 지정하거나 isMain을 모두 false로 설정 (현재는 모두 false로)
      if (wasMain) {
        return filtered.map((img, idx) => ({
          ...img,
          sortOrder: idx,
          isMain: false,
        }));
      }

      // 삭제된게 대표가 아님 - 기존 대표 이미지를 유지
      const oldMainIndex = prev.findIndex((i) => i.isMain);

      //삭제 후 새로운 메인 이미지 인덱스를 계산
      const newMainIndex =
        oldMainIndex > index ? oldMainIndex - 1 : oldMainIndex;

      return filtered.map((img, idx) => ({
        ...img,
        sortOrder: idx, // 삭제 이미지 인덱스 고려 재정렬
        isMain: idx === newMainIndex, //계산된 새로운 인덱스 사용
      }));
    });
  };

  return (
    // 상품 이미지
    <div className="mt-4">
      <p className="font-medium my-3">상품 이미지</p>

      <div className="flex gap-1.5 overflow-x-auto items-center">
        {/* 이미지 업로드 버튼 */}
        <button
          type="button"
          className="shrink-0 relative w-20 h-20 border rounded-xl flex items-center justify-center bg-gray-200 text-brand-darkgray text-sm"
          onClick={() => fileInputRef.current.click()}
          // onClick={handleUploadClick}
        >
          <div className="absolute left-6.5 top-2/5 -translate-y-1/2">
            <Upload className="size-7" />
          </div>
          <div className="absolute bottom-2.5 text-[12pt]">
            <span className="text-brand-green">{images.length}</span>/5
          </div>
        </button>

        {/* 실제 파일 input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* 미리보기 상태 이미지들 */}
        <div className="flex gap-1.5 items-center h-25">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 cursor-pointer "
              // onClick={() => setAsMain(idx)}
            >
              <div
                className="relative w-full h-full overflow-hidden border rounded-xl"
                onClick={() => setAsMain(idx)}
              >
                <img
                  src={img.preview || img.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {img.isMain && (
                  <div className="absolute bottom-0 left-0 w-full bg-black opacity-80 text-white text-xs text-center py-0.5">
                    대표사진
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  // e.stopPropagation();
                  removeImage(idx, e);
                }}
                className="absolute -top-1 -right-1 bg-gray-200 rounded-full cursor-pointer"
              >
                {/* <X className="text-gray-600 stroke-2 w-5 h-5" /> */}

                <CircleX className="text-gray-600 stroke-2 w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageUploader;
