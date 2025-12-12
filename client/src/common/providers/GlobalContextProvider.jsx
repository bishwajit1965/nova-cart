import { useEffect, useState } from "react";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import GlobalContext from "../context/GlobalContext";
import toast from "react-hot-toast";

const GlobalContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  /** ---------------- CART QUERY ---------------- */
  const {
    data: cartsData,
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
  } = useApiQuery({
    url: API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("CART DATA IN CONTEXT", cartsData);
  /** ---------------- MUTATIONS ---------------- */

  const updateCartMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${payload.productId}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    onError: () => toast.error("Failed to update cart"),
  });

  const deleteCartMutation = useApiMutation({
    method: "delete",
    path: (productId) =>
      `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${productId}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
  });

  /** ---------------- SYNC CART ON FETCH ---------------- */

  useEffect(() => {
    if (cartsData?.items) {
      setCart(cartsData?.items);
    } else {
      setCart([]);
    }
  }, [cartsData]);

  /** ---------------- CART OPERATIONS ---------------- */

  // Update quantity helper
  const updateQuantity = (productId, newQty) => {
    const payload = { data: { productId, quantity: newQty }, productId };

    updateCartMutation.mutate(payload, {
      onSuccess: (res) => {
        const updatedItem = res?.data?.item;
        if (!updatedItem?.product) return;

        // Sync UI with server response
        setCart((prev) =>
          prev.map((item) =>
            item.product._id === updatedItem.product._id
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
      },

      onError: () => toast.error("Quantity update failed"),
    });
  };

  // Increase quantity
  const handleIncreaseQuantity = (productId) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      const newQty = updated.find((i) => i.product._id === productId).quantity;
      updateQuantity(productId, newQty);
      return updated;
    });
  };

  // Decrease quantity
  const handleDecreaseQuantity = (productId) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      );

      const newQty = updated.find((i) => i.product._id === productId).quantity;
      updateQuantity(productId, newQty);
      return updated;
    });
  };

  // Delete item
  const handleRemoveItem = (productId) => {
    deleteCartMutation.mutate(productId, {
      onSuccess: () => {
        // Just remove from UI
        setCart((prev) =>
          prev.filter((item) => item.product._id !== productId)
        );
        toast.success("Item removed");
      },

      onError: () => toast.error("Failed to remove item"),
    });
  };

  /** ---------------- STATUS HANDLERS ---------------- */

  const cartsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
    label: "cartsData",
  });

  /** ---------------- CONTEXT VALUE ---------------- */

  const globalContext = {
    cart,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRemoveItem,
    cartsDataStatus,
  };

  return (
    <GlobalContext.Provider value={globalContext}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
