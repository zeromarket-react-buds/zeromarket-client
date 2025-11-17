import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const value = { memo: "히히", me: me, setMe: setMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
