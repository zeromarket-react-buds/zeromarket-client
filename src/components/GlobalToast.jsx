import { ToastContainer, toast } from "react-toastify";

// 찜 토스트 함수
export const useLikeToast = () => {
  const showLikeAddedToast = () => {
    toast.success("찜 목록에 추가되었어요!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  const showLikeRemovedToast = () => {
    toast.info("찜 목록에서 삭제했어요.", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };
  return { showLikeAddedToast, showLikeRemovedToast };
};

// 이후 다른쪽에서 필요한 토스트 알림 추가시에는 여기에 새롭게 해당 기능 export const 함수 추가

// 거래 토스트 함수
export const useTradeToast = () => {
  const showCompletedUpdatedToast = () => {
    toast.success("거래 완료되었습니다", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  const showCanceledUpdatedToast = () => {
    toast.info("거래 취소되었습니다.", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  const showSoftDeletedToast = () => {
    toast.info("거래 내역이 삭제되었습니다.", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  return {
    showCompletedUpdatedToast,
    showCanceledUpdatedToast,
    showSoftDeletedToast,
  };
};

export const GlobalToast = () => {
  return <ToastContainer />;
};
