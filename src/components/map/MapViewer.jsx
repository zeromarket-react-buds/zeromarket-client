import { useEffect, useRef, forwardRef } from "react";
import { getCategoryEmoji } from "./map.constant";

const getMarkerContentHtml = (categoryName, productTitle) => {
  const emoji = getCategoryEmoji(categoryName);
  return `
    <div class="custom-marker-wrapper pointer-events-none">
      <div class="marker-tooltip !block"> ${productTitle}
      </div>
      <div class="marker-emoji">
        ${emoji}
      </div>
    </div>`;
};

const MapViewer = forwardRef(({ center, selectedLocation, category }, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const overlayRef = useRef(null);

  const initializeMap = (lat, lng) => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const position = new kakao.maps.LatLng(lat, lng);
      //지도 인스턴스가 없는 경우 최초 1회 실행
      if (!mapRef.current) {
        const map = new kakao.maps.Map(containerRef.current, {
          center: position,
          level: 4,
        });
        mapRef.current = map;

        const CustomOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: getMarkerContentHtml(
            category,
            selectedLocation.locationName || "직거래 장소"
          ),
          yAnchor: 1.3,
        });

        CustomOverlay.setMap(map);
        overlayRef.current = CustomOverlay;
      } else {
        mapRef.current.setCenter(position);
        if (overlayRef.current) {
          overlayRef.current.setPosition(position);
          overlayRef.current.setContent(
            getMarkerContentHtml(
              category,
              selectedLocation.locationName || "직거래 장소"
            )
          );
        }
      }

      setTimeout(() => mapRef.current.relayout(), 0);
    });
  };

  useEffect(() => {
    const finalLat =
      selectedLocation?.lat || selectedLocation?.latitude || center?.lat;
    const finalLng =
      selectedLocation?.lng || selectedLocation?.longitude || center?.lng;

    if (!finalLat || !finalLng) return;

    // 1- SDK 로드 상태 확인 및 대기
    if (!window.kakao || !window.kakao.maps) {
      const intervalId = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(intervalId);
          // SDK 로드 완료 후 지도 초기화 시도
          initializeMap(finalLat, finalLng);
        }
      }, 100);
      return () => clearInterval(intervalId);
    }

    // 2- SDK가 이미 로드된 경우 또는 대기 후 실행
    initializeMap(finalLat, finalLng);
  }, [center, selectedLocation, category]); // 의존성 변경 시 항상 실행

  return <div ref={containerRef} className="w-full h-full" />;
});

export default MapViewer;
