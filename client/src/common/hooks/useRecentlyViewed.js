// src/client/hooks/useRecentlyViewed.js
import { useState, useEffect } from "react";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";

const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // ✅ FETCH — source of truth
  const { data, isLoading, refetch } = useApiQuery({
    path: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_ENDPOINT,
    key: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  });

  // ✅ sync local state
  useEffect(() => {
    if (data?.data) setRecentlyViewed(data.data);
  }, [data]);

  // ✅ ADD recently viewed
  const addMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_ENDPOINT,
    key: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_KEY,
    showToast: false,
    options: { staleTime: 0, refetchOnWindowFocus: false },
    onSuccess: () => refetch(),
    onError: (err) => console.error("❌ addRecentlyViewed failed", err),
  });

  const addRecentlyViewed = ({ productId, variantId }) => {
    addMutation.mutate({ data: { productId, variantId } });
  };

  // ✅ REMOVE recently viewed
  const removeMutation = useApiMutation({
    method: "delete",
    path: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_ENDPOINT,
    key: API_PATHS.CLIENT_RECENTLY_VIEWED.CLIENT_KEY,
    showToast: false,
    options: { staleTime: 0, refetchOnWindowFocus: false },
    onSuccess: () => refetch(),
    onError: (err) => console.error("❌ removeRecentlyViewed failed", err),
  });

  const removeRecentlyViewed = ({ productId, variantId }) => {
    removeMutation.mutate({ data: { productId, variantId } });
  };

  return {
    recentlyViewed,
    setRecentlyViewed, // 🔑 acid-test ready
    loading: isLoading,
    refetchRecentlyViewed: refetch,
    addRecentlyViewed,
    removeRecentlyViewed,
  };
};

export default useRecentlyViewed;
