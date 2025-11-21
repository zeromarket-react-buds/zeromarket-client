import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = function ({ children }) {
  const [me, setMe] = useState(null);
  const value = { memo: "히히", me: me, setMe: setMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = function useAuth() {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth };
