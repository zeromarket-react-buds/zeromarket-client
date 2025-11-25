import { ToastContainer, toast } from "react-toastify";

// 토스트 함수
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

export const GlobalToast = () => {
  return <ToastContainer />;
};
