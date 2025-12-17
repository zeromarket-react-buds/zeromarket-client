import { getBlockListApi } from "@/common/api/block.api";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

const BlockUserLIstPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState();

  const fetchBlockList = async (query) => {
    if (loading) return;
    setLoading(true);

    try {
      const data = await getBlockListApi(query);
      console.log("차단 목록 응답:", data);
      setData(data);
    } catch (err) {
      console.error("차단 목록 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockList();
  }, []);

  return (
    <Container className="-mt-5">
      <div className="flex flex-col gap-6 mx-6">
        <div>
          <span className="text-brand-green font-semibold pl-5">
            {data?.nickname ?? ""}
          </span>
          님은 현재
          <span className="pl-4 pr-1 text-brand-green text-2xl font-semibold">
            {data?.blockedUserCount ?? 0}
          </span>
          명을 차단 중입니다.
        </div>
        {(data?.list ?? []).map((d) => (
          <div key={d.blockId} className="flex flex-col gap-3">
            <div className="flex justify-between border border-brand-mediumgray rounded-2xl items-center px-6 py-2">
              <div className="flex flex-row gap-6 items-center">
                {d?.profileImage ? (
                  <img
                    src={d.profileImage}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <User className="w-10 h-10 rounded-full p-1 bg-brand-green text-brand-ivory" />
                )}

                <div className="text-lg line-clamp-1">
                  {d.blockedUserNickname}
                </div>
              </div>
              <Button
                variant="green"
                type="button"
                className="rounded-2xl text-end"
              >
                차단해제
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default BlockUserLIstPage;
