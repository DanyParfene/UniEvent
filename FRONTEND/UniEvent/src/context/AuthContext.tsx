import { createContext, useContext, useReducer, type ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  current_role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; token: string } }
  | { type: "LOGOUT" };

interface AuthContextType {
  state: AuthState;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  user: JSON.parse(sessionStorage.getItem("auth_user") || "null"),
  token: sessionStorage.getItem("auth_token") || null,
  isAuthenticated: !!sessionStorage.getItem("auth_token"),
};

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const login = (user: User, token: string) => {
    sessionStorage.setItem("auth_user", JSON.stringify(user));
    sessionStorage.setItem("auth_token", token);
    dispatch({ type: "LOGIN", payload: { user, token } });
  };

  const logout = () => {
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_token");
    dispatch({ type: "LOGOUT" });
  };

  const value = { state, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};