import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { subscribe, getSnapshot, setAuth, clearAuth, updateUser } from "../lib/auth-store";
import { axiosInstance } from "../lib/axios";
import type { User } from "../lib/auth-store";

export type { User };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );

  const login = (user: User, token: string): void => {
    setAuth(user, token);
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post("/auth/logout");
    } finally {
      clearAuth();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
