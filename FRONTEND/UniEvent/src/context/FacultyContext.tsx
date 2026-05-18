import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import uvtLogo from "../assets/uvt-long.png"
import arteLogo from "../assets/ARTE-logo.png"
import cbgLogo from "../assets/CBG-logo.png"
import dreptLogo from "../assets/DREPT-logo.png"
import feeaLogo from "../assets/FEAA-logo.png"
import fefsLogo from "../assets/FEFS-logo.png"
import ffmLogo from "../assets/FFM-logo.png"
import infoLogo from "../assets/INFO-logo.png"
import fliftLogo from "../assets/FLIFT-logo.png"
import fmtLogo from "../assets/FMT-logo.png"
import fpseLogo from "../assets/FPSExDPPD-logo.png"
import fsasLogo from "../assets/FSAS-logo.png"
import fsgcLogo from "../assets/FSGC-logo.png"

export type FacultyId =
  | "UVT"
  | "ARTE"
  | "CBG"
  | "DREPT"
  | "FEAA"
  | "FEFS"
  | "FFM"
  | "INFO"
  | "FLIFT"
  | "FMT"
  | "FPSE"
  | "FSAS"
  | "FSGC";

interface FacultyTheme {
  primary: string;
  secondary: string;
}

export const facultyLogoMap: Record<FacultyId, string> = {
  UVT: uvtLogo,
  ARTE: arteLogo,
  CBG: cbgLogo,
  DREPT: dreptLogo,
  FEAA: feeaLogo,
  FEFS: fefsLogo,
  FFM: ffmLogo,
  INFO: infoLogo,
  FLIFT: fliftLogo,
  FMT: fmtLogo,
  FPSE: fpseLogo,
  FSAS: fsasLogo,
  FSGC: fsgcLogo,
};

const facultyThemeMap: Record<FacultyId, FacultyTheme> = {
  UVT: { primary: "primary-uvt", secondary: "secondary-uvt" },
  ARTE: { primary: "primary-arte", secondary: "secondary-arte" },
  CBG: { primary: "primary-cbg", secondary: "secondary-cbg" },
  DREPT: { primary: "primary-drept", secondary: "secondary-drept" },
  FEAA: { primary: "primary-feaa", secondary: "secondary-feaa" },
  FEFS: { primary: "primary-fefs", secondary: "secondary-fefs" },
  FFM: { primary: "primary-ffm", secondary: "secondary-ffm" },
  INFO: { primary: "primary-info", secondary: "secondary-info" },
  FLIFT: { primary: "primary-flift", secondary: "secondary-flift" },
  FMT: { primary: "primary-fmt", secondary: "secondary-fmt" },
  FPSE: { primary: "primary-fpse", secondary: "secondary-fpse" },
  FSAS: { primary: "primary-fsas", secondary: "secondary-fsas" },
  FSGC: { primary: "primary-fsgc", secondary: "secondary-fsgc" },
};

interface FacultyState {
  isAdmin: boolean;
  currentFaculty: FacultyId;
  currentLogo: string;
}

type FacultyAction =
  | { type: "CHANGE_FACULTY"; payload: FacultyId }
  | { type: "SET_IS_ADMIN" };

interface FacultyContextType {
  state: FacultyState;
  changeFaculty: (faculty: FacultyId) => void;
  // currentLogo: string;
  setIsAdmin: () => void;
}

const initialState: FacultyState = {
  isAdmin: true,
  currentFaculty: sessionStorage.getItem("user_faculty") as FacultyId || "UVT",
  currentLogo: uvtLogo,
};

const FacultyReducer = (
  state: FacultyState,
  action: FacultyAction,
): FacultyState => {
  switch (action.type) {
    case "CHANGE_FACULTY":
      if (!state.isAdmin) {
        return state;
      }
      return {
        ...state,
        currentFaculty: action.payload,
        currentLogo: facultyLogoMap[action.payload],
      };
    case "SET_IS_ADMIN":
      return {
        ...state,
        isAdmin: true,
      };
    default:
      return state;
  }
};

const FacultyContext = createContext<FacultyContextType | undefined>(undefined);

export const FacultyProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(FacultyReducer, initialState);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = facultyThemeMap[state.currentFaculty];

    if (currentTheme) {
      root.style.setProperty(
        "--color-primary",
        `var(--color-${currentTheme.primary})`,
      );
      root.style.setProperty(
        "--color-secondary",
        `var(--color-${currentTheme.secondary})`,
      );
    }
    
    sessionStorage.setItem("user_faculty", state.currentFaculty);
  }, [state.currentFaculty]);

  const changeFaculty = (faculty: FacultyId) => {
    dispatch({
      type: "CHANGE_FACULTY",
      payload: faculty,
    });
  };



  const setIsAdmin = () => {
    dispatch({ type: "SET_IS_ADMIN" });
  };

  const value = { state, changeFaculty, setIsAdmin };
  return (
    <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
  );
};

export const useFaculty = () => {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
