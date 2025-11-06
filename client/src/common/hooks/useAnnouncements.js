import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";

// import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
// import useApi from "../../hooks/useApi";

const useAnnouncements = () => {
  //   const api = useApi();
  return useQuery({
    queryKey: API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_KEY,
    queryFn: async () => {
      const { data } = await api.get(
        `${API_PATHS.SUP_ADMIN_ANNOUNCEMENT.SUP_ADMIN_ANNOUNCEMENT_ENDPOINT}/all/active`
      );
      return data?.data || [];
    },
  });
};

export default useAnnouncements;
