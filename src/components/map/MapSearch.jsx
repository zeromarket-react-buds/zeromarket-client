import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";

/**
 * @description 검색 전용 지도 컴포넌트: 홈 화면, 상품 검색 페이지에서 사용됩니다.
 * 지도를 이동/확대할 때마다 검색 경계가 변경되면 콜백을 호출합니다.
 * @param {object} center - 초기 지도 중심
 * @param {function} onSearchBoundaryChange - 지도를 이동/확대 완료 시 호출되는 콜백
 * @param {Array<object>} products - 지도에 표시할 상품 배열 (추가)
 */

//실제 마커로 쓰일 카테고리별 이모지 및 마커html 생성 (컴포넌트 외부로 분리하여 메모리 효율)
const getMarkerContentHtml = (categoryName, productId) => {
  const emojiMap = {
    "가구/인테리어": "🏠",
    도서: "📚",
    "디지털/가전": "💻",
    "생활/건강": "🌱",
    식품: "🍎",
    "스포츠/레저": "⚽",
    "여가/생활편의": "🎬",
    "출산/육아": "🍼",
    패션의류: "👕",
    패션잡화: "👜",
    "화장품/미용": "💄",
    ETC: "📦",
  };
  const emoji = emojiMap[categoryName] || emojiMap["ETC"];
  return `
        <div 
          onclick="goToProductDetail(${productId})" 
          style="padding: 5px; border-radius: 50%; background-color: white; border: 2px solid #22c55e; box-shadow: 0 2px 4px rgba(0,0,0,0.2); font-size: 20px; cursor: pointer;"
        >
          ${emoji}
        </div>`;
};

const MapSearch = forwardRef(({ center, onSearchBoundaryChange }, ref) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);
  const productMarkersRef = useRef([]);

  //전역으로 클릭핸들러 등록
  useEffect(() => {
    window.goToProductDetail = (productId) => {
      navigate(`/products/${productId}`);
    };
    return () => {
      delete window.goToProductDetail; // 언마운트 시 삭제 <
    };
  }, [navigate]);

  //부모 컴포넌트에서 호출할수있게 기능 노출
  useImperativeHandle(ref, () => ({
    displayProducts: (products) => {
      console.log("마커표시시작:", products);
      if (!mapRef.current) return;

      // 기존 마커(커스텀 오버레이) 제거
      productMarkersRef.current.forEach((marker) => marker.setMap(null));
      productMarkersRef.current = [];

      products.forEach((product) => {
        if (product.latitude && product.longitude) {
          const position = new kakao.maps.LatLng(
            product.latitude,
            product.longitude
          );

          const customOverlay = new kakao.maps.CustomOverlay({
            position: position,
            content: getMarkerContentHtml(product.category, product.productId),
            yAnchor: 1.2, // 마커 위치
            zIndex: 3,
            // clickable: true,
          });

          customOverlay.setMap(mapRef.current);
          productMarkersRef.current.push(customOverlay);
        } else {
          console.warn(
            `상품 ID ${product.productId} 에 좌표 정보가 없습니다.`,
            product
          );
        }
      });
    },

    moveToMyLocation: () => {
      if (navigator.geolocation && mapRef.current) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const myLatLng = new kakao.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
          );
          mapRef.current.panTo(myLatLng);
        });
      }
    },
  }));

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      const map = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 4,
      });

      mapRef.current = map;

      map.setDraggable(true);
      map.setZoomable(true);

      const updateBoundary = () => {
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        const centerPos = map.getCenter();

        onSearchBoundaryChange?.({
          centerLat: centerPos.getLat(),
          centerLng: centerPos.getLng(),
          swLat: sw.getLat(),
          swLng: sw.getLng(),
          neLat: ne.getLat(),
          neLng: ne.getLng(),
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
          },
          (error) => {
            if (err.code === 1) {
              console.warn(
                "사용자가 위치 정보 공유를 거부했습니다. 기본 위치로 지도를 표시합니다."
              );
            } else {
              console.error("위치 정보 획득 실패:", err.message);
            }
          }
        );
      }

      setTimeout(() => map.relayout(), 0);
    });

    // return () => {
    //   if (mapRef.current && window.kakao?.maps) {
    //     // kakao.maps.event.removeListener(mapRef.current, 'idle', updateBoundary); // updateBoundary 함수를 밖으로 빼서 접근 가능하게 해야 함
    //   }
    // };
  }, [center.lat, center.lng, onSearchBoundaryChange]);

  return <div ref={containerRef} className="w-full h-full" />;
});

export default MapSearch;
