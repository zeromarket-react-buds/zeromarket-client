import MapSearch from "@/components/map/MapSearch";
import { useRef, useCallback } from "react";
import { getProductsByMapBoundaryApi } from "@/common/api/product.api";
import { useAuth } from "@/hooks/AuthContext";

const NearbyProductsMapPage = () => {
  const mapRef = useRef(null);
  const { user } = useAuth();
  const memberId = user?.memberId ?? 0;

  const SearchBoundaryChange = useCallback(
    async (boundary) => {
      try {
        const searchParams = {
          swLat: boundary.swLat,
          swLng: boundary.swLng,
          neLat: boundary.neLat,
          neLng: boundary.neLng,
          size: 10,
        };

        const result = await getProductsByMapBoundaryApi(
          searchParams,
          memberId
        );
        const fetchedProducts = result.content || [];
        // console.log("지도 영역 상품 데이터:", fetchedProducts);

        if (mapRef.current) {
          mapRef.current.displayProducts(fetchedProducts);
        }
      } catch (error) {
        console.log("상품 목록 조회 실패", error);
      }
    },
    [memberId]
  );

  return (
    <div className="relative h-[100dvh]">
      <div className=" absolute inset-0">
        <MapSearch
          ref={mapRef}
          center={{
            lat: 37.5665, // 서울시청
            lng: 126.978,
          }}
          onSearchBoundaryChange={SearchBoundaryChange}
        />
      </div>
    </div>
  );
};
export default NearbyProductsMapPage;
