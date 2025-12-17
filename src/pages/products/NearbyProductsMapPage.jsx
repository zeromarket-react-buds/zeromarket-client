import MapSearch from "@/components/map/MapSearch";
import { Crosshair } from "lucide-react";
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

      <div
        className="fixed left-0 right-0 bottom-0 z-50 p-4 pointer-events-none"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-end items-end mb-3 ">
          <div
            onClick={() => mapRef.current?.moveToMyLocation()}
            className="map-control-btn pointer-events-auto"
          >
            <Crosshair variant="outline" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default NearbyProductsMapPage;
