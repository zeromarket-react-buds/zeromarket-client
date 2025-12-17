import MapSearch from "@/components/map/MapSearch";
import { Crosshair } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useCallback, useMemo } from "react";
import { getProductsByMapBoundaryApi } from "@/common/api/product.api";
import { useAuth } from "@/hooks/AuthContext";

const NearbyProductsMapPage = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const previousForm = routerLocation.state?.form;
  const mapRef = useRef(null);
  const { user } = useAuth();
  const memberId = user?.memberId || 0; //0말고 수정필요
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const SearchBoundaryChange = useCallback(
    async (boundary) => {
      try {
        const searchParams = {
          swLat: boundary.swLat,
          swLng: boundary.swLng,
          neLat: boundary.neLat,
          neLng: boundary.neLng,
          size: 5,
          // 페이지네이션/키워드/카테고리 필터링 추가
        };

        const result = await getProductsByMapBoundaryApi(
          searchParams,
          memberId
        );

        const fetchedProducts = result.content || [];
        console.log("지도 영역 내 상품 데이터:", fetchedProducts);

        if (mapRef.current) {
          mapRef.current.displayProducts(fetchedProducts);
        }
      } catch (error) {
        console.log("상품 목록 조회 실패", error);
      }
    },
    [memberId]
  );

  const geocoder = useMemo(() => {
    if (window.kakao?.maps?.services) {
      return new window.kakao.maps.services.Geocoder();
    }
    return null;
  }, []);

  const handleMapSelect = useCallback(
    ({ lat, lng }) => {
      if (!geocoder) return;
      geocoder.coord2RegionCode(lng, lat, (codes, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          console.error("법정동 코드 변환 실패");
          setSelectedLocation(null);
          setLocationName("");
          return;
        }

        const legalDongInfo = codes.find((c) => c.region_type === "B");
        const bCode = legalDongInfo ? legalDongInfo.code : null;

        geocoder.coord2Address(lng, lat, (result, addressStatus) => {
          if (addressStatus !== window.kakao.maps.services.Status.OK) {
            console.error("주소 변환 실패");
            setSelectedLocation(null);
            setLocationName("");
            return;
          }

          const detail = result[0];
          const roadAddress = detail.road_address?.address_name || null;
          const jibunAddress = detail.address?.address_name || null;

          const locationObject = {
            locationName: roadAddress || jibunAddress || "선택한 위치",
            latitude: lat,
            longitude: lng,
            roadAddress,
            jibunAddress,
            buildingName:
              detail.road_address?.building_name ??
              detail.address?.building_name ??
              null,
            zipCode:
              detail.road_address?.zone_no ?? detail.address?.zip_code ?? null,

            legalDongCode: bCode,
          };

          console.log("선택된 최종 위치 객체:", locationObject);
          setSelectedLocation(locationObject);
          setLocationName(locationObject.locationName);
        });
      });
    },
    [geocoder]
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
          // onSelect={handleMapSelect}
          // selectedLocation={selectedLocation}
        />
        {isSheetOpen && (
          <div
            className="absolute inset-0 z-40 cursor-default"
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "rgba(0, 0, 0, 0)" }} // 투명하게 유지
          />
        )}
      </div>

      <div
        className="fixed left-0 right-0 bottom-0 z-50 p-4 pointer-events-none"
        style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-end items-end mb-3 ">
          <div className="bg-white rounded-full size-[60px] p-2 flex items-center justify-center shadow-xl cursor-pointer pointer-events-auto">
            <Crosshair
              variant="outline"
              size={30}
              onClick={() => mapRef.current?.moveToMyLocation()}
            />
          </div>
        </div>

        {/* <Button
          variant="green"
          className=" w-full py-7 text-lg pointer-events-auto"
          disabled={!selectedLocation}
          onClick={handleSelectComplete}
        >
          선택 완료
        </Button> */}
      </div>
    </div>
  );
};
export default NearbyProductsMapPage;
