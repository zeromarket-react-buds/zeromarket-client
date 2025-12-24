import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Crosshair } from "lucide-react";
import { useMapToast } from "@/components/GlobalToast";
import { getCategoryEmoji } from "./map.constant";
import { useModal } from "@/hooks/useModal";

const getMarkerContentHtml = (categoryName, productId, productTitle) => {
  const emoji = getCategoryEmoji(categoryName);
  return `
    <div class="custom-marker-wrapper" onclick="goToProductDetail(${productId})">
      <div class="marker-tooltip">
        ${productTitle}
      </div>
      <div class="marker-emoji">
        ${emoji}
      </div>
    </div>`;
};

const MapSearch = forwardRef(({ center, onSearchBoundaryChange }, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const productMarkersRef = useRef([]);
  const circleRef = useRef(null);
  const [radius, setRadius] = useState(800);
  const radiusRef = useRef(radius);
  const lastProductsRef = useRef([]);
  const { showLocationDeniedToast } = useMapToast();
  const { alert } = useModal();
  const [locationStatus, setLocationStatus] = useState("prompt");
  useEffect(() => {
    radiusRef.current = radius;
  }, [radius]);

  const handleMoveToMyLocation = async () => {
    if (!navigator.geolocation) {
      // 브라우저 자체에서 위치기능 미제공시(Geolocation API 미탑재)
      await alert({
        description: "이 브라우저에서는 위치 서비스를 지원하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });

      if (result.state === "denied") {
        showLocationDeniedToast();
      } else {
        moveToMyLocation();
      }
    } catch (error) {
      //위치정보는 주는 브라우저지만, 권한확인기능(permissions API)미지원시
      moveToMyLocation();
    }
  };

  //원 업뎃 함수
  const updateSearchCircle = (latlng, currentRadius) => {
    if (!mapRef.current || !latlng) return;

    const r = currentRadius || radius;

    // 만약 기존 원이 지도에 표시되고 있다면 먼저 제거 (확실한 초기화)
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    // if (circleRef.current) {
    //   circleRef.current.setPosition(latlng);
    //   circleRef.current.setRadius(r);
    // } else {
    circleRef.current = new kakao.maps.Circle({
      center: latlng,
      radius: r, //m단위 반지름(1.5km)
      strokeWeight: 1,
      strokeColor: "#1b6439",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
      fillColor: "#34d399",
      fillOpacity: 0.15,
    });
    circleRef.current.setMap(mapRef.current);
  };
  // };

  //마커표시로직(거리필터링포함)
  const drawFilteredMarkers = (products, currentRadius) => {
    if (!mapRef.current) return;

    productMarkersRef.current.forEach((marker) => marker.setMap(null));
    productMarkersRef.current = [];

    const centerPos = mapRef.current.getCenter();
    const r = currentRadius || radius;
    products.forEach((product) => {
      if (product.latitude && product.longitude) {
        const productPos = new kakao.maps.LatLng(
          product.latitude,
          product.longitude
        );
        const line = new kakao.maps.Polyline({ path: [centerPos, productPos] });
        const distance = line.getLength();

        if (distance <= r) {
          const customOverlay = new kakao.maps.CustomOverlay({
            position: productPos,
            content: getMarkerContentHtml(
              product.category,
              product.productId,
              product.productTitle
            ),
            yAnchor: 1.3,
            zIndex: 3,
          });
          customOverlay.setMap(mapRef.current);
          productMarkersRef.current.push(customOverlay);
        }
      }
    });
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (mapRef.current) {
      updateSearchCircle(mapRef.current.getCenter(), newRadius);
      drawFilteredMarkers(lastProductsRef.current, newRadius);
    }
  };
  //전역 클릭 핸들러
  useEffect(() => {
    window.goToProductDetail = (productId) => {
      navigate(`/products/${productId}`);
    };
    return () => {
      delete window.goToProductDetail;
    };
  }, [navigate]);

  //부모 컴포넌트에서 호출할수있게 기능 노출
  useImperativeHandle(ref, () => ({
    displayProducts: (products) => {
      lastProductsRef.current = products;
      drawFilteredMarkers(products);
      // console.log("마커표시시작:", products);
      // if (!mapRef.current) return;
    },

    moveToMyLocation: () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const latlng = new kakao.maps.LatLng(lat, lng);

          mapRef.current?.panTo(latlng);
          // mapRef.current?.setCenter(latlng);

          // 내 위치로 이동할 때 원형 범위 업데이트
          updateSearchCircle(latlng);
        });
      }
    },
  }));

  useEffect(() => {
    if (mapRef.current && center) {
      const initialLatLng = new kakao.maps.LatLng(center.lat, center.lng);
      updateSearchCircle(initialLatLng);
    }
  }, [center]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const map = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      });
      mapRef.current = map;

      //지도 생성 직후 relayout 실행
      map.relayout();

      const startLatLng = new kakao.maps.LatLng(center.lat, center.lng);
      updateSearchCircle(startLatLng);

      map.setDraggable(true);
      map.setZoomable(true);

      const updateBoundary = () => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const centerPos = map.getCenter();

        updateSearchCircle(centerPos, radiusRef.current);
        // updateSearchCircle(centerPos, radius); //state 대신 ref 값 사용 > 함수 재생성X이어도 항상 최신값

        onSearchBoundaryChange?.({
          centerLat: centerPos.getLat(),
          centerLng: centerPos.getLng(),
          swLat: sw.getLat(),
          swLng: sw.getLng(),
          neLat: ne.getLat(),
          neLng: ne.getLng(),
          radius: radiusRef.current,
        });
      };

      kakao.maps.event.addListener(map, "idle", updateBoundary);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const myLatLng = new kakao.maps.LatLng(
              pos.coords.latitude,
              pos.coords.longitude
            );
            map.setCenter(myLatLng);
            updateSearchCircle(myLatLng, radiusRef.current);
            updateBoundary();
          },
          (error) => {
            updateBoundary();
            if (error.code === 1) {
              console.warn(
                "사용자가 위치 정보 공유를 거부했습니다. 기본 위치로 지도를 표시합니다."
              );
            } else {
              console.error("위치 정보 획득 실패:", error.message);
            }
          }
        );
      } else {
        updateBoundary();
      }

      setTimeout(() => map.relayout(), 0);
    });
  }, [onSearchBoundaryChange]); // center.lat/lng 의존성없어야 무한루프 방지

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 right-4 z-[10] flex flex-col gap-3 items-center">
        <div className="flex flex-col gap-2  bg-white p-2 rounded-lg shadow-md border border-gray-200">
          <p className="text-[14px] font-bold text-brand-darkgray text-center mb-1">
            탐색 범위
          </p>
          {[300, 800, 1500].map((r) => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                radius === r
                  ? "bg-brand-green text-white"
                  : "bg-brand-lightgray text-brand-darkgray hover:bg-brand-mediumgray"
              }`}
            >
              {r >= 1000 ? `${r / 1000}km` : `${r}m`}
            </button>
          ))}
        </div>
        <button
          onClick={handleMoveToMyLocation}
          className="map-control-btn pointer-events-auto"
        >
          <Crosshair size={24} className="text-brand-darkgray" />
        </button>
      </div>

      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
});

export default MapSearch;
