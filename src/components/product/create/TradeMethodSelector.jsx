import { GreenCheckBox } from "@/components/ui/greencheckbox";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

import { useNavigate } from "react-router-dom";

const TradeMethodSelector = ({ value, images, onChange }) => {
  const delivery = value?.delivery ?? false;
  const direct = value?.direct ?? false;
  const location = value?.location;
  const navigate = useNavigate();

  const handleToggle = (type) => (checked) => {
    onChange({
      delivery: type === "delivery" ? checked : delivery,
      direct: type === "direct" ? checked : direct,
    });
  };

  const removeLocation = (e) => {
    e.stopPropagation();
    onChange({
      delivery,
      direct,
      location: null,
    });
  };

  return (
    <div className="mt-8">
      {/* 거래 방법 */}
      <p className="font-bold mb-2 border-b py-2 text-lg">거래 방법</p>
      <div className=" mt-4 space-y-2">
        <GreenCheckBox
          label="택배거래"
          checked={delivery}
          onChange={handleToggle("delivery")}
        />
        <p className="text-gray-400 text-sm mt-1 mb-5">배송비 포함(무료배송)</p>
        <GreenCheckBox
          label="직거래"
          checked={direct}
          onChange={handleToggle("direct")}
        />
      </div>

      {/* 직거래 선택시 뜨는 장소 */}
      {direct && (
        <div className="flex gap-2 flex-wrap mt-2 ">
          {location && (
            <div>
              <Button className="bg-gray-200 text-black rounded-3xl">
                <span>{location.locationName}</span>
                <span onClick={removeLocation}>
                  <X className="text-brand-darkgray" />
                </span>
              </Button>
            </div>
          )}

          {/* <Button className="bg-gray-200 text-black rounded-3xl">
            <span>역삼2동</span>
            <span>
              <X className="text-brand-darkgray" />
            </span>
          </Button> */}
          {!location && (
            <Button
              className="bg-white border-2 border-gray-200 text-black rounded-3xl"
              onClick={() =>
                navigate("/products/location", {
                  state: {
                    form: value,
                    images: images,
                  },
                })
              }
            >
              <span>
                <Plus className="text-brand-darkgray" />
              </span>
              <span>위치 설정</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default TradeMethodSelector;
