import { ToastContainer, toast } from "react-toastify";

export const useLikeToast = () => {
  const showLikeToast = () => {
    toast.success("찜 목록에 추가되었어요!", {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: true,
      pauseOnHover: false,
    });
  };

  return { showLikeToast };
};

export const GlobalToast = () => {
  return <ToastContainer />;
};
