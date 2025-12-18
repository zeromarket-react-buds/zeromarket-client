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

// 프로필 토스트 함수
export const useProfileToast = () => {
  const showProfileUpdatedToast = () => {
    toast.success("프로필 수정이 완료되었습니다", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  return {
    showProfileUpdatedToast,
  };
};

// 프로필 토스트 함수
export const useBlockToast = () => {
  const showUnblockToast = () => {
    toast.success("해당 유저를 차단 해제했습니다", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  return {
    showUnblockToast,
  };
};

export const useMapToast = () => {
  const showLocationDeniedToast = () => {
    toast.error("위치 정보 접근을 허용해주세요.", {
      toastId: "location-denied",
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };
  return { showLocationDeniedToast };
};

export const GlobalToast = () => {
  return <ToastContainer />;
};
