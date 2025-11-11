import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";

const useAnnouncements = () => {
  return useQuery({
    queryKey: API_PATHS.CLIENT_ANNOUNCEMENT.CLIENT_ANNOUNCEMENT_KEY,
    queryFn: async () => {
      const { data } = await api.get(
        `${API_PATHS.CLIENT_ANNOUNCEMENT.CLIENT_ANNOUNCEMENT_ENDPOINT}/all/active`
      );
      return data?.data || [];
    },
  });
};

export default useAnnouncements;
