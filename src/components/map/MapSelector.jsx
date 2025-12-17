import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

/**
 * @description 쓰기 전용 지도 컴포넌트: 상품 등록/수정 페이지에서 사용됩니다.
 * 핀 이동 가능하며, 초기 로딩 시 현재 위치로 이동합니다.
 * @param {object} center - 초기 지도 중심 (Geolocation 실패 시 대체용)
 * @param {function} onSelect - 지도 클릭 또는 현재 위치 로드 시 호출되는 콜백 ({ lat, lng })
 * @param {object} selectedLocation - 현재 선택된 위치 (리렌더링 시 핀 위치 고정용)
 */
const MapSelector = forwardRef(
  ({ center, onSelect, selectedLocation }, ref) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const selectMarkerRef = useRef(null);
    const myLatLngRef = useRef(null);

    // Geolocation 요청 로직 분리함수
    const moveAndSelectPosition = (latlng) => {
      if (mapRef.current && selectMarkerRef.current) {
        mapRef.current.setCenter(latlng);
        selectMarkerRef.current.setPosition(latlng);
        onSelect?.({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      }
    };

    useImperativeHandle(ref, () => ({
      moveToMyLocation: () => {
        if (!mapRef.current) return;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = pos.coords.latitude;
              const lng = pos.coords.longitude;
              const myLatLng = new kakao.maps.LatLng(lat, lng);
              moveAndSelectPosition(myLatLng);
            },
            (error) => {
              console.error("Geolocation failed:", error);
              alert(
                "현재 위치를 가져올 수 없습니다. 지도를 직접 움직여 주세요."
              );
            }
          );
        } else {
          alert("현재 브라우저는 위치 정보를 지원하지 않습니다.");
        }
      },
    }));

    useEffect(() => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        const defaultCenter = new kakao.maps.LatLng(center.lat, center.lng);
        let initialCenter = defaultCenter;
        let initialMarkerPosition = defaultCenter;

        if (selectedLocation?.lat && selectedLocation?.lng) {
          const selectedLatLng = new kakao.maps.LatLng(
            selectedLocation.lat,
            selectedLocation.lng
          );
          initialCenter = selectedLatLng;
          initialMarkerPosition = selectedLatLng;
        } else if (selectedLocation?.latitude && selectedLocation?.longitude) {
          const selectedLatLng = new kakao.maps.LatLng(
            selectedLocation.latitude,
            selectedLocation.longitude
          );
          initialCenter = selectedLatLng;
          initialMarkerPosition = selectedLatLng;
        }

        const map = new kakao.maps.Map(containerRef.current, {
          center: initialCenter,
          level: 4,
        });

        mapRef.current = map;

        const selectMarker = new kakao.maps.Marker({
          position: initialMarkerPosition,
          draggable: true,
        });
        selectMarker.setMap(map);
        selectMarkerRef.current = selectMarker;

        map.setDraggable(true);
        map.setZoomable(true);

        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const latlng = mouseEvent.latLng;
          selectMarker.setPosition(latlng);

          onSelect?.({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        });

        kakao.maps.event.addListener(selectMarker, "dragend", () => {
          const latlng = selectMarker.getPosition();
          onSelect?.({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        });

        setTimeout(() => map.relayout(), 0);
      });
    }, [center, onSelect, selectedLocation]);

    useEffect(() => {
      if (mapRef.current && selectMarkerRef.current && selectedLocation) {
        const lat = selectedLocation.lat || selectedLocation.latitude;
        const lng = selectedLocation.lng || selectedLocation.longitude;

        if (lat && lng) {
          const newLatLng = new kakao.maps.LatLng(lat, lng);
          selectMarkerRef.current.setPosition(newLatLng);
        }
      }
    }, [selectedLocation]);

    return <div ref={containerRef} className="w-full h-full" />;
  }
);

export default MapSelector;
