// src/client/hooks/useRecentlyViewed.js
import { useState, useEffect } from "react";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import toast from "react-hot-toast";
import useCart from "./useCart";
import { useAuth } from "./useAuth";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";

const useRecentlyViewed = () => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const CART_LENGTH_LIMIT = 10; // Define a constant for cart length limit

  // ✅ FETCH — source of truth
  const {
    data: viewedProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
    refetch,
  } = useApiQuery({
    url: API_PATHS.CLIENT_RECENTLY_VIEWED.ENDPOINT,
    queryKey: API_PATHS.CLIENT_RECENTLY_VIEWED.KEY,
    options: {
      enabled: !!user,
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  });

  // ✅ sync local state
  useEffect(() => {
    if (viewedProducts) {
      const filtered = viewedProducts.filter((item) => {
        return !cart?.items?.some(
          (cartItem) =>
            String(cartItem.product._id) === String(item._id) &&
            (cartItem.variantId ?? null) === (item.variantId ?? null),
        );
      });
      setRecentlyViewed(filtered);
    }
  }, [viewedProducts, cart]);

  // ✅ ADD recently viewed
  const addMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_RECENTLY_VIEWED_PRODUCTS.ENDPOINT,
    key: API_PATHS.CLIENT_RECENTLY_VIEWED_PRODUCTS.KEY,
    showToast: false,
    options: { staleTime: 0, refetchOnWindowFocus: false },
    onSuccess: () => {
      toast.success("Product added to recently viewed");
      refetch();
    },
    onError: (err) => console.error("❌ addRecentlyViewed failed", err),
  });

  const addRecentlyViewed = ({ productId, variantId }) => {
    addMutation.mutate({ data: { productId, variantId } });
  };

  // ✅ REMOVE recently viewed
  const removeMutation = useApiMutation({
    method: "delete",
    path: ({ productId, variantId }) =>
      variantId
        ? `${API_PATHS.CLIENT_RECENTLY_VIEWED_PRODUCTS.ENDPOINT}/${productId}/${variantId}`
        : `${API_PATHS.CLIENT_RECENTLY_VIEWED_PRODUCTS.ENDPOINT}/${productId}`,
    key: API_PATHS.CLIENT_RECENTLY_VIEWED_PRODUCTS.KEY,
    showToast: false,
    options: { staleTime: 0, refetchOnWindowFocus: false },
    onSuccess: () => {
      toast.success("Product removed from recently viewed");
      refetch();
    },
    onError: (err) => console.error("❌ removeRecentlyViewed failed", err),
  });

  const removeRecentlyViewed = ({ productId, variantId }) => {
    if (cart.length >= CART_LENGTH_LIMIT) {
      toast.error("Cart is full. Cannot remove product from recently viewed.");
      return;
    }
    removeMutation.mutate({ productId, variantId });
  };

  const viewedProductsDataStatus = useFetchedDataStatusHandler({
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: errorProducts,
    label: "Viewed products",
  });

  return {
    recentlyViewed,
    setRecentlyViewed, // 🔑 acid-test ready
    loading: isProductsLoading,
    refetchRecentlyViewed: refetch,
    addRecentlyViewed,
    removeRecentlyViewed,
    viewedProductsDataStatus,
  };
};

export default useRecentlyViewed;
