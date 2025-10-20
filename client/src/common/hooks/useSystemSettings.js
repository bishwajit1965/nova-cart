import SystemSettingContext from "../context/systemSettingContext";
import { useContext } from "react";

export const useSystemSettings = () => {
  const context = useContext(SystemSettingContext);
  if (!context) {
    throw new Error(
      "useSystemSettings must be used within a SystemSettingsProvider"
    );
  }
  return context;
};

export default useSystemSettings;
