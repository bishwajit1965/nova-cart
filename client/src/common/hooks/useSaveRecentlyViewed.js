// hooks/useRecentlyViewed.js
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";

export const useSaveRecentlyViewed = () => {
  const mutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_PRODUCT_ACTIVITY.ENDPOINT}`,
    key: API_PATHS.CLIENT_PRODUCT_ACTIVITY.KEY,
    showToast: false,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    // onSuccess: (res) => console.log("DB updated successfully", res),
    // onError: (err) => console.error(err),
  });

  const save = (productId) => {
    // save to database
    mutation.mutate({ data: productId });
  };

  return { save };
};

export default { useSaveRecentlyViewed };
