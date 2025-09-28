import apiService from "../api/apiService";
import { useQuery } from "@tanstack/react-query";

export const useApiQuery = ({
  queryKey,
  url,
  params = {},
  enabled = true,
  select,
  onSuccess,
  onError,
  retry = 1,
  staleTime = 0,
  cacheTime = 5 * 60 * 1000,
  fetcher = (url, { params }) =>
    apiService.getAll(url, { params }).then((res) => {
      console.log("Hook got the response:", res);
      return res.data;
    }),
  refetchOnWindowFocus = true,
  options = {},
}) => {
  return useQuery({
    queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    queryFn: () => fetcher(url, { params }),
    enabled,
    select,
    onSuccess,
    onError,
    retry,
    staleTime,
    cacheTime,
    refetchOnWindowFocus,
    ...options,
  });
};
