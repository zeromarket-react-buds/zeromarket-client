import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

export const useAuthHelper = () => {
  const { checkSession } = useAuth();
  const navigate = useNavigate();

  const ensureLogin = async (redirectPath = "/login") => {
    const isLogged = await checkSession();
    if (!isLogged) {
      navigate(redirectPath);
      return false;
    }
    return true;
  };

  return { ensureLogin };
};
