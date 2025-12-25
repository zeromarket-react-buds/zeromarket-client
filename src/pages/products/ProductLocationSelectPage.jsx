import MapSelector from "@/components/map/MapSelector";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useCallback, useMemo } from "react";
import LocationNameSheet from "@/components/product/create/LocationNameSheet";

const ProductLocationSelectPage = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const mapRef = useRef(null);
  const previousForm = routerLocation.state?.form;
  const previousImages = routerLocation.state?.images;
  const returnPath = routerLocation.state?.from || "/products";
  const [selectedLocation, setSelectedLocation] = useState(
    previousForm?.location || null
  );
  const [locationName, setLocationName] = useState(
    previousForm?.location?.locationName || ""
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  //주소<>위도/경도 변환위한 Geocoder객체
  const geocoder = useMemo(() => {
    if (window.kakao?.maps?.services) {
      return new window.kakao.maps.services.Geocoder();
    }
    return null;
  }, []);

  //지도 클릭시 좌표>주소 변환
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

  const handleSelectComplete = () => {
    setIsSheetOpen(true);
  };

  //장소명 확정>상품등록페이지로 전달
  const handleSubmitLocation = () => {
    navigate(returnPath, {
      replace: true,
      state: {
        selectedLocation: {
          ...selectedLocation,
          locationName: locationName, //수정한 최종장소명
        },
        form: previousForm,
        images: previousImages,
        // form: routerLocation.state?.form ?? null,
      },
    });
  };

  return (
    <div className="relative h-[100dvh]">
      <div className=" absolute inset-0">
        <MapSelector
          ref={mapRef}
          center={{
            lat: 37.5665, // 서울시청
            lng: 126.978,
          }}
          onSelect={handleMapSelect}
          selectedLocation={selectedLocation}
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
          <div
            onClick={() => mapRef.current?.moveToMyLocation()}
            className="map-control-btn"
          >
            <Crosshair size={24} />
          </div>
        </div>

        <Button
          variant="green"
          className=" w-full py-7 text-lg pointer-events-auto"
          disabled={!selectedLocation}
          onClick={handleSelectComplete}
        >
          선택 완료
        </Button>
      </div>

      <LocationNameSheet
        isOpen={isSheetOpen}
        value={locationName}
        onChange={setLocationName} //위치 이름 상태를 직접 업뎃
        onClose={() => setIsSheetOpen(false)}
        onSubmit={handleSubmitLocation}
      />
    </div>
  );
};
export default ProductLocationSelectPage;
