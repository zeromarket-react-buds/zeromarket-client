import { useEffect, useRef, forwardRef } from "react";

const MapViewer = forwardRef(({ center, selectedLocation }, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const initializeMap = (lat, lng) => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const position = new kakao.maps.LatLng(lat, lng); //지도 인스턴스가 없는 경우 최초 1회 실행

      if (!mapRef.current) {
        const map = new kakao.maps.Map(containerRef.current, {
          center: position,
          level: 4,
        });
        mapRef.current = map;

        const viewerMarker = new kakao.maps.Marker({
          position: position,
          map: map,
        });
        markerRef.current = viewerMarker;
      } else {
        mapRef.current.setCenter(position);
        if (markerRef.current) {
          markerRef.current.setPosition(position);
        }
      }

      setTimeout(() => mapRef.current.relayout(), 0);
    });
  };

  useEffect(() => {
    const finalLat = selectedLocation.lat || center.lat;
    const finalLng = selectedLocation.lng || center.lng;

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
  }, [center, selectedLocation]); // center와 selectedLocation 변경 시 항상 실행

  return <div ref={containerRef} className="w-full h-full" />;
});

export default MapViewer;
