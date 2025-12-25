import { useMemo, useState, useEffect, useCallback } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { XCircle, Settings2, Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { getKeywordApi, updateKeywordsApi } from "@/common/api/keyword.api";
import { useHeader } from "@/hooks/HeaderContext";
import { useModal } from "@/hooks/useModal";

const KeywordAlertEditPage = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const { alertId } = useParams();
  const { alert, confirm } = useModal();

  const [keywordState, setKeywordState] = useState("");
  const [priceMinState, setPriceMinState] = useState("");
  const [priceMaxState, setPriceMaxState] = useState("");
  const { setHeader } = useHeader();

  const fetchKeywordAlert = async () => {
    const data = await getKeywordApi(alertId);
    console.log("data", data);
    setKeywordState(data.keyword);
    setFormattedPrice(String(data.priceMin), setPriceMinState);
    setFormattedPrice(String(data.priceMax), setPriceMaxState);
  };

  const handleUpdate = useCallback(async () => {
    const keyword = keywordState.trim();
    const priceMin = priceMinState
      ? parseInt(priceMinState.replace(/,/g, ""))
      : null;
    const priceMax = priceMaxState
      ? parseInt(priceMaxState.replace(/,/g, ""))
      : null;

    console.log("변환된 값:", priceMin, priceMax);
    if (!keyword) {
      await alert({ description: "키워드를 입력해주세요." });
      return;
    }
    if (priceMin && !priceMax) {
      await alert({ description: "최대가격을 입력해주세요." });
      return;
    }
    if (!priceMin && priceMax) {
      await alert({ description: "최소가격을 입력해주세요." });
      return;
    }
    if (priceMin && priceMax && priceMin >= priceMax) {
      await alert({ description: "최대 가격은 최소 가격보다 커야 합니다." });
      return;
    }

    if (!(await confirm({ description: "수정하시겠습니까?" }))) {
      return;
    }
    await updateKeywordsApi({ alertId, keyword, priceMin, priceMax });
    await alert({ description: "수정되었습니다." });
    fetchKeywordAlert();
  }, [keywordState, priceMinState, priceMaxState]);

  const setFormattedPrice = (price, setter) => {
    if (!price) {
      setter("");
      return;
    }
    const numValue = price.replace(/[^0-9]/g, "");
    const commaValue = numValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setter(commaValue);
  };

  useEffect(() => {
    if (loading) return;

    setHeader({
      titleAlign: "left",
      showHome: false,
      rightSlot: (
        <span
          className="cursor-pointer text-brand-green font-bold"
          onClick={handleUpdate}
        >
          완료
        </span>
      ),
    });
  }, [loading, setHeader, handleUpdate]);

  useEffect(() => {
    if (loading) return;
    fetchKeywordAlert();
  }, [loading]);

  return (
    <Container>
      <div className="flex flex-col gap-8 ">
        <div className="flex flex-col gap-4 p-2">
          <p className="mx-2">키워드</p>
          <div className="flex">
            <Input
              className="h-12 rounded-2xl mx-2"
              value={keywordState}
              onChange={(e) => setKeywordState(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2">
          <p className="mx-2">가격</p>
          <div className="flex">
            <Input
              className="h-12 rounded-2xl mx-2"
              placeholder="최소 가격"
              value={priceMinState}
              onChange={(e) =>
                setFormattedPrice(e.target.value, setPriceMinState)
              }
            />
            <span className="flex mx-2 items-center justify-center">
              &minus;
            </span>
            <Input
              className="h-12 rounded-2xl mx-2"
              placeholder="최대 가격"
              value={priceMaxState}
              onChange={(e) =>
                setFormattedPrice(e.target.value, setPriceMaxState)
              }
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default KeywordAlertEditPage;
