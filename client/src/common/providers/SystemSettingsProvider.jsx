import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import SystemSettingContext from "../context/systemSettingContext";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const SystemSettingsProvider = ({ children }) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [systemSettings, setSystemSettings] = useState(null);

  // Fetch existing system preferences
  const {
    data: systemData,
    isLoadingSystemPreferences,
    isErrorSystemPreferences,
    errorSystemPreferences,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT}/get-create`,
    queryKey:
      API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
        .SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_KEY,
  });

  console.log("System Data----->", systemData);

  const systemSettingsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingSystemPreferences,
    isError: isErrorSystemPreferences,
    error: errorSystemPreferences,
    label: "System Preferences",
  });

  useEffect(() => {
    if (systemData) {
      setSystemSettings(systemData);
      /***  ----> Dynamic Favicon ----> */
      const faviconLink =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      faviconLink.rel = "icon";
      faviconLink.href = `${apiURL}/uploads/${systemData.favicon}`;

      document.head.appendChild(faviconLink);

      /***  ----> Dynamic Title ----> */
      document.title = systemData.appName || "Nova Cart";

      /***  ----> Dynamic Meta Description----> */
      const metaDesc =
        document.querySelector("meta[name='description']") ||
        document.createElement("meta");
      metaDesc.name = "description";
      metaDesc.content =
        systemData.metaDescription ||
        "Nova Cart - The next generation e-commerce solution.";
      document.head.appendChild(metaDesc);

      /** ------> Theme color setting ------> */
      const systemThemeColor = systemData.themeColor || "#2563EB";
      let themeColorMeta =
        document.querySelector('meta[name="theme-color"]') ||
        document.createElement("meta");
      themeColorMeta.name = "theme-color";
      themeColorMeta.setAttribute("content", systemThemeColor);
      document.head.appendChild(themeColorMeta);
    }
  }, [systemData]);

  if (systemSettingsDataStatus.status !== "success")
    return systemSettingsDataStatus.content;

  const systemSettingInfo = {
    systemSettings,
    isLoading: isLoadingSystemPreferences,
    isError: isErrorSystemPreferences,
    error: errorSystemPreferences,
  };

  return (
    <SystemSettingContext.Provider value={systemSettingInfo}>
      {children}
    </SystemSettingContext.Provider>
  );
};

export default SystemSettingsProvider;
