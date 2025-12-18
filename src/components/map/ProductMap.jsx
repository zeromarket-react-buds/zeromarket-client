import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

const ProductMap = forwardRef(
  ({ center, onSelect, readOnly, selectedLocation }, ref) => {
    const containerRef = useRef(null);
    const mapRef = useRef(null);
    const selectMarkerRef = useRef(null);
    const myLatLngRef = useRef(null);

    useImperativeHandle(ref, () => ({
      moveToMyLocation,
    }));

    useEffect(() => {
      if (!window.kakao || !window.kakao.maps) return;

      window.kakao.maps.load(() => {
        //초기위치
        const defaultCenter = new kakao.maps.LatLng(center.lat, center.lng);
        let initialCenter = defaultCenter;
        let initialMarkerPosition = defaultCenter;

        if (readOnly && selectedLocation?.lat && selectedLocation?.lng) {
          const selectedLatLng = new kakao.maps.LatLng(
            selectedLocation.lat,
            selectedLocation.lng
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
        });
        selectMarker.setMap(map);
        selectMarkerRef.current = selectMarker;

        if (readOnly) {
          map.setDraggable(false);
          map.setZoomable(true);
          selectMarker.setDraggable(false);
        } else {
          selectMarker.setDraggable(true);
        }

        //클릭
        kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          if (readOnly) return;

          const latlng = mouseEvent.latLng;
          selectMarker.setPosition(latlng);

          onSelect?.({
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          });
        });

        //현위치
        if (!readOnly && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const myLatLng = new kakao.maps.LatLng(lat, lng);
            myLatLngRef.current = myLatLng;

            map.setCenter(myLatLng);
            selectMarker.setPosition(myLatLng);

            onSelect?.({ lat, lng });
          });
        }
        // else if (readOnly && selectedLocation) {
        //   //바로 맵보여줌
        // }

        setTimeout(() => map.relayout(), 0);
      });
    }, [center, onSelect, readOnly, selectedLocation]);

    const moveToMyLocation = () => {
      if (!mapRef.current || !myLatLngRef.current || readOnly) return;

      mapRef.current.setCenter(myLatLngRef.current);
      selectMarkerRef.current.setPosition(myLatLngRef.current);

      onSelect?.({
        lat: myLatLngRef.current.getLat(),
        lng: myLatLngRef.current.getLng(),
      });
    };

    return (
      <div>
        충돌 확인용 코드 추가!
        <div ref={containerRef} className="w-full h-full" />
      </div>
    );
  }
);

export default ProductMap;
