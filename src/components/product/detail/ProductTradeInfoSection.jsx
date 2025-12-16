import MapViewer from "@/components/map/MapViewer";

const ProductTradeInfoSection = ({ detail }) => {
  const centerLat = detail.latitude || 37.5665; //기본값 서울시청
  const centerLng = detail.longitude || 126.978;

  return (
    <div className=" my-5 text-sm  ">
      <div className="flex justify-between mb-4">
        <span className="font-semibold">거래방법</span>
        <div>
          {detail.direct && detail.delivery && (
            <span>직거래 가능 | 택배거래 가능</span>
          )}
          {!detail.direct && detail.delivery && <span>택배거래 가능</span>}
          {detail.direct && !detail.delivery && <span>직거래 가능</span>}
        </div>
      </div>

      {detail.direct && (
        <div>
          <div className="flex justify-between mb-4">
            <span className="font-semibold">거래위치</span>
            <span>{detail.sellingArea}</span>
          </div>
          <div className="bg-gray-200 w-full h-90 border text-gray-600">
            <MapViewer
              center={{
                lat: centerLat,
                lng: centerLng,
              }}
              selectedLocation={{ lat: centerLat, lng: centerLng }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductTradeInfoSection;
