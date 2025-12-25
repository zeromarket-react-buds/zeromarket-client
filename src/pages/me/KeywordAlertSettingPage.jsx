import { useMemo, useState, useEffect, useRef } from "react";
import Container from "@/components/Container";
import { Input } from "@/components/ui/input";
import { XCircle, Settings2, Check, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getKeywordsApi,
  createKeywordsApi,
  updateKeywordsApi,
  deleteKeywordsApi,
} from "@/common/api/keyword.api";
import { useModal } from "@/hooks/useModal";

const Box = ({ children }) => (
  <div className="w-full border rounded-2xl p-8 min-h-[30vh]">{children}</div>
);

const KeywordCard = ({ keywordAlert, onUpdate, onDelete }) => {
  return (
    <div className="border border-brand-mediumgray rounded-2xl p-5">
      <div className="flex flex-row gap-10 items-center">
        <div className="px-6">{keywordAlert.keyword}</div>
        <div className="grow"></div>
        <div className="flex flex-row gap-2">
          <span
            className="text-brand-green cursor-pointer"
            onClick={() => onUpdate(keywordAlert.alertId)}
          >
            <Settings2 />
          </span>
          <span
            className="text-brand-green cursor-pointer"
            onClick={() => onDelete(keywordAlert.alertId)}
          >
            <XCircle />
          </span>
        </div>
      </div>
    </div>
  );
};
const KeywordAlertSettingPage = () => {
  const navigate = useNavigate();
  const { loading } = useAuth();
  const [keywordAlerts, setKeywordAlerts] = useState([]);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const STORAGE_KEY = "recent_searches";
  const keywordRef = useRef("");
  const { alert, confirm } = useModal();

  const getRecentKeywords = () => {
    const savedLocal = localStorage.getItem(STORAGE_KEY);
    if (!savedLocal) {
      setRecentKeywords([]);
      return;
    }
    setRecentKeywords(JSON.parse(savedLocal));
  };

  const fetchKeywordAlerts = async () => {
    const data = await getKeywordsApi();
    setKeywordAlerts(data);
  };

  const handleRegister = async (paramKeyword = "") => {
    const keyword = paramKeyword ? paramKeyword : keywordRef.current?.value;
    console.log("keywordRef", keyword);
    if (!(await confirm({ description: "키워드 알림을 등록하시겠습니까?" }))) {
      return;
    }
    const result = await createKeywordsApi({ keyword });
    fetchKeywordAlerts();
  };

  const handleUpdate = (alertId) => {
    navigate(`/me/keywords/edit/${alertId}`);
  };

  const handleDelete = async (alertId) => {
    if (
      !(await confirm({ description: "키워드 알림에서 삭제하시겠습니까?" }))
    ) {
      return;
    }
    const result = await deleteKeywordsApi(alertId);
    fetchKeywordAlerts();
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    getRecentKeywords();
    fetchKeywordAlerts();
  }, [loading]);

  return (
    <Container>
      <div className="flex flex-col gap-8 ">
        <div className="relative p-2">
          <Input
            placeholder="알림 받을 키워드를 등록해주세요."
            className="h-10 pr-16"
            ref={keywordRef}
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-sm text-brand-green h-full px-2 cursor-pointer"
            onClick={handleRegister}
          >
            등록
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2 min-h-[30vh]">
          {keywordAlerts && keywordAlerts.length > 0 ? (
            keywordAlerts.map((data) => (
              <KeywordCard
                key={data.alertId}
                keywordAlert={data}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              ></KeywordCard>
            ))
          ) : (
            <div className="flex items-center justify-center text-center text-brand-darkgray">
              아직 등록된 키워드가 없어요
            </div>
          )}
        </div>

        <Box>
          <div className="flex flex-col gap-6">
            {recentKeywords && recentKeywords.length > 0 ? (
              <>
                <p className="">
                  사용자님이 <span className="text-brand-green">최근 본</span>{" "}
                  키워드예요.
                </p>
                <div className="flex flex-row gap-4 p-2">
                  {recentKeywords.map((keywordObj) => {
                    if (
                      keywordAlerts
                        .map((k) => k.keyword)
                        .includes(keywordObj.keyword)
                    ) {
                      return (
                        <Badge
                          className="bg-brand-mediumgray"
                          key={keywordObj.ts}
                        >
                          {keywordObj.keyword}
                          <Check />
                        </Badge>
                      );
                    } else {
                      return (
                        <Badge
                          className="cursor-pointer"
                          key={keywordObj.ts}
                          onClick={() => handleRegister(keywordObj.keyword)}
                        >
                          {keywordObj.keyword}
                          <Plus />
                        </Badge>
                      );
                    }
                  })}
                </div>
              </>
            ) : (
              <>
                <p className="">
                  <span className="text-brand-green">최근 본</span> 키워드가
                  없어요.
                </p>
              </>
            )}
          </div>
        </Box>
      </div>
    </Container>
  );
};

export default KeywordAlertSettingPage;
