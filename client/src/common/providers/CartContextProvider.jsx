import { useEffect, useState } from "react";
import CartContext from "../context/CartContext";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [globalCartData, setGlobalCartData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIdToken, setDeleteIdToken] = useState(null);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // all available products

  /*** Global cart data */
  /*** -------> Fetch Cart Query -------> */
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

  /*** -------> Fetch Coupon Query -------> */
  const {
    data: coupons,
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
  } = useApiQuery({
    url: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT,
    queryKey: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** --------> Update Cart --------> */
  const updateCartMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${payload.productId}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving permission");
      console.error(error);
    },
  });

  /*** ------> Remove from Cart ------> */
  const deleteCartMutation = useApiMutation({
    method: "delete",
    path: (productId) =>
      `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${productId}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /*** ------> Fetch Products Query ------> */
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PRODUCTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PRODUCTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (products) {
      const initialCart = products?.map((prod) => ({
        product: prod,
        quantity: 1, //default quantity=1
      }));
      setAllProducts(initialCart);
    }
  }, [products]);

  useEffect(() => {
    if (cartsData?.items) {
      setGlobalCartData(cartsData?.items);
    } else {
      setGlobalCartData([]);
    }
  }, [cartsData]);

  /*** Products data fetched status */
  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "products",
  });

  /*** Cart data fetched status */
  const cartsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
    label: "cartsData",
  });

  /*** Coupon data fetched status */
  const couponDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
    label: "Coupon",
  });

  /*** -------> Coupon Mutation -------> */
  const couponMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT,
    key: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
  });
  /*** ------> handle generate coupon code ------> */
  const handleGenerateCouponCode = (e) => {
    e?.preventDefault();
    if (cart?.length === 0) {
      toast.error("Your cart is empty! Add products to cart.");
      return;
    }
    const payload = { data: { code: "code" } };
    couponMutation.mutate(payload);
    navigate("/client-cart-checkout");
  };

  /*** ---> Increase cart product quantity ---> */
  const handleIncreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      // Send backend update
      const newQty = updatedCart.find(
        (i) => i.product._id === productId
      ).quantity;
      updateQuantity(productId, newQty);

      return updatedCart;
    });
  };

  /*** --------> Decrease cart product quantity -------- */
  const handleDecreaseQuantity = (productId) => {
    const updatedCart = cart?.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setCart(updatedCart);
    updateQuantity(
      productId,
      updatedCart.find((i) => i.product._id === productId).quantity
    );
  };

  /** ----> Update cart product quantity ----> */
  const updateQuantity = (productId, newQty) => {
    const payload = { data: { productId, quantity: newQty } };

    updateCartMutation.mutate(payload, {
      onSuccess: (res) => {
        const updatedItem = res.data.item;

        if (!updatedItem || !updatedItem.product) return;

        setCart((prevCart) =>
          prevCart.map((item) =>
            item?.product?._id === updatedItem.product._id
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
      },
      onError: (err) => {
        toast.error("Failed to update quantity", err);
      },
    });
  };

  /*** -----> Handle Delete Modal open Toggle----->  */
  const handleDeleteModalToggle = (productId) => {
    setIsDeleteModalOpen(true);
    setDeleteIdToken(productId);
  };

  //*** --------> Remove product from cart -------- */
  const handleRemoveItem = async (productId) => {
    try {
      deleteCartMutation.mutate(productId, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
        onError: (error) => {
          toast.error("Error in deleting cart item!", error);
        },
      });
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  /*** ------> Clear cart handler ------> */

  const cartInfo = {
    globalCartData,
    cartsDataStatus,
    coupons,
    couponDataStatus,
    deleteIdToken,
    isDeleteModalOpen,
    product,
    allProducts,
    handleGenerateCouponCode,
    setDeleteIdToken,
    setIsDeleteModalOpen,
    setProduct,
    setAllProducts,
    updateQuantity,
    handleRemoveItem,
    handleDeleteModalToggle,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
  };

  return (
    <CartContext.Provider value={cartInfo}>{children}</CartContext.Provider>
  );
};

export default CartContextProvider;
