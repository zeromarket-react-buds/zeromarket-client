import { getBlockListApi, updateUnblockApi } from "@/common/api/block.api";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import { useBlockToast } from "@/components/GlobalToast";
import { useAuth } from "@/hooks/AuthContext";

const BlockUserLIstPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { alert, confirm } = useModal();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { showUnblockToast } = useBlockToast();

  const list = data?.list ?? [];

  const isEmpty = useMemo(() => {
    // loading 중일 때 없습니다가 잠깐 보이는 것 방지
    if (loading) return false;
    return list.length === 0;
  }, [loading, list.length]);

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
    if (!isAuthenticated && !authLoading) {
      (async () => {
        await alert({
          description: "차단 유저 목록 페이지는 로그인 후 접근이 가능합니다.",
        });
        navigate("/login", { replace: true });
      })();
    }
  }, [authLoading, isAuthenticated, navigate, alert]);

  useEffect(() => {
    fetchBlockList();
  }, []);

  const submitUnBlock = async (e, blockId) => {
    e.stopPropagation(); // 전체 클릭으로 인한 이동 방지
    if (saving) return;

    const ok = await confirm({
      description: "차단을 해제하시겠습니까?",
    });

    if (!ok) return;

    setSaving(true);
    showUnblockToast();
    try {
      await updateUnblockApi(blockId); // is_active = false 처리
      await fetchBlockList(); // 목록 갱신
    } catch (err) {
      console.error("차단 해제 실패:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="-mt-5">
      {isEmpty ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="text-brand-green font-semibold">
            {data?.nickname ?? ""}
          </span>
          님은 현재 차단한 유저가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-6 mx-6">
          <div className="flex justify-center items-end">
            <span className="text-brand-green font-semibold">
              {data?.nickname ?? ""}
            </span>
            님은 현재
            <span className="pl-4 pr-1 text-brand-green text-2xl font-semibold">
              {data?.blockedUserCount ?? list.length}
            </span>
            명을 차단 중입니다.
          </div>

          {list.map((d) => (
            <div
              key={d.blockId}
              className="flex flex-col gap-3"
              onClick={() => navigate(`/sellershop/${d.blockedUserId}`)}
            >
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
                  onClick={(e) => submitUnBlock(e, d.blockId)}
                >
                  차단해제
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default BlockUserLIstPage;
