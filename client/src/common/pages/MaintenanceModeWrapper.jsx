import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import MaintenanceScreen from "./MaintenanceScreen";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";

const MaintenanceWrapper = ({ children }) => {
  const {
    data: systemData,
    isLoadingPreferences,
    isErrorPreferences,
    errorPreferences,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS.SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_ENDPOINT}/get-create`,
    queryKey:
      API_PATHS.SUP_ADMIN_SYSTEM_SETTINGS
        .SUP_ADMIN_SYSTEM_SETTINGS_PREFERENCES_KEY,
  });

  const systemPreferenceDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingPreferences,
    isError: isErrorPreferences,
    error: errorPreferences,
    label: "System Preferences",
  });

  // ✅ Return early for loading or error
  if (systemPreferenceDataStatus.status !== "success") {
    return systemPreferenceDataStatus.content;
  }

  // ✅ Return maintenance screen if active
  if (systemData?.maintenanceMode) {
    return <MaintenanceScreen />;
  }

  // ✅ Otherwise, render children normally
  return children;
};

export default MaintenanceWrapper;
