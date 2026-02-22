// src/client/hooks/useCart.js
import { useEffect, useState } from "react";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import toast from "react-hot-toast";
import useFetchedDataStatusHandler from "../utils/hooks/useFetchedDataStatusHandler";

const CART_LIMIT = 10;
const WISHLIST_LIMIT = 10;

const useCart = () => {
  const [cart, setCart] = useState([]);
  const [viewCart, setViewCart] = useState(true);
  const [addedToCart, setAddedToCart] = useState([]); // { productId, variantId, quantity }
  const [wishList, setWishList] = useState([]);
  const [addedToWishList, setAddedToWishList] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loadingCartId, setLoadingCartId] = useState(null);
  const [loadingWishListId, setLoadingWishListId] = useState(null);
  const [deleteModalData, setDeleteModalData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const { addRecentlyViewed } = useRecentlyViewed();

  /* ------------------ QUERY APIS ------------------ */
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

  const {
    data: wishListData,
    isLoading: isWishListLoading,
    isError: isWishListError,
    error: errorWishListData,
  } = useApiQuery({
    url: API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT,
    queryKey: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

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

  /* ------------------ MUTATIONS ------------------ */
  const addToCartMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    showToast: false,
    onSuccess: (res) => {
      setCart(res.data.items);
      setAddedToCart(
        res.data.items.map((item) => ({
          productId: item.product?._id,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          item: item,
        })),
      );
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

  const addToWishListMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    showToast: false,
    onSuccess: (res) => {
      setWishList(res.data.items);
      setAddedToWishList(
        res.data.items.map((item) => ({
          productId: item.product?._id,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
          item: item,
        })),
      );
    },
    onError: (err) => {
      toast.error("Failed to add product to wishlist");
      console.error(err);
    },
  });

  const updateCartMutation = useApiMutation({
    method: "update",
    path: ({ productId }) =>
      `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${productId}`,
    onError: () => toast.error("Failed to update cart"),
  });

  const deleteCartMutation = useApiMutation({
    method: "delete",
    path: ({ productId, variantId }) =>
      variantId
        ? `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${productId}/${variantId}`
        : `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}/${productId}`,
    onError: () => toast.error("Failed to remove item"),
  });

  const couponMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT,
    key: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
  });

  /* ------------------ EFFECTS ------------------ */
  useEffect(() => {
    setCart(cartsData?.items ?? []);
  }, [cartsData]);

  useEffect(() => {
    setWishList(wishListData?.items ?? []);
  }, [wishListData]);

  useEffect(() => {
    if (products) {
      const initialCart = products.map((prod) => ({
        product: prod,
        quantity: 1,
      }));
      setAllProducts(initialCart);
    }
  }, [products]);

  useEffect(() => {
    const normalized = cart.map((item) => ({
      productId: item.product?._id,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
      item,
    }));

    setAddedToCart(normalized);
  }, [cart]);

  useEffect(() => {
    const normalized = wishList.map((item) => ({
      productId: item.product?._id,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
      item,
    }));
    wishList;

    setAddedToWishList(normalized);
  }, [wishList]);

  /* ------------------ HELPERS ------------------ */

  const normalizeVariantId = (variant) => variant?._id ?? null;

  const hasVariants = (product) =>
    Array.isArray(product?.variants) && product.variants.length > 0;

  const getFirstVariant = (product) =>
    hasVariants ? product.variants[0] : null;

  const isInCart = (productId, variantId) =>
    cart.some(
      (i) =>
        i.product?._id === productId &&
        (i.variantId ?? null) === (variantId ?? null),
    );

  const isInWishList = (productId, variantId) =>
    wishList.some(
      (i) =>
        i?.product?._id === productId &&
        (i.variantId ?? null) === (variantId ?? null),
    );

  const findItemIndex = (productId, variantId) =>
    cart.findIndex(
      (i) =>
        i.product?._id === productId &&
        (i.variantId ?? null) === (variantId ?? null),
    );

  const syncCart = (productId, variantId, quantity) =>
    updateCartMutation.mutateAsync({
      data: { productId, variantId, quantity },
      productId,
    });

  /* ------------------ HANDLERS ------------------ */

  const handleAddToCart = ({ product, variant = null, quantity = 1 }) => {
    const requiresVariant = (product) =>
      Array.isArray(product?.variants) && product?.variants?.length > 0;

    if (requiresVariant(product) && !variant) {
      toast.error("Please select a variant");
      return;
    }

    if (addedToCart.length >= CART_LIMIT) {
      toast.error(`You can only add up to ${CART_LIMIT} items in your cart`);
      return;
    }

    const payload = {
      data: {
        productId: product._id,
        variantId: normalizeVariantId(variant),
        quantity,
      },
    };

    setLoadingCartId(product._id);
    addToCartMutation.mutateAsync(payload, {
      onSuccess: (res) => {
        toast.success(`"${product.name}" added to cart!`);
      },
      onError: (error) => {
        toast.error(`${error.response?.data?.message}`);
      },
      onSettled: () => {
        setLoadingCartId(null);
      },
    });
  };

  const handleAddToWishList = ({ product, variant = null }) => {
    if (
      !variant &&
      Array.isArray(product.variants) &&
      product.variants.length > 0
    ) {
      toast.error("Please select a variant");
      return;
    }

    if (addedToWishList.length >= WISHLIST_LIMIT) {
      toast.error(`You can add up to ${WISHLIST_LIMIT} items in wishlist`);
      return;
    }

    const payload = {
      data: {
        productId: product._id,
        variantId: normalizeVariantId(variant),
        quantity: 1,
      },
    };

    setLoadingWishListId(product._id);
    addToWishListMutation.mutateAsync(payload, {
      onSuccess: () => toast.success(`"${product.name}" added to wishlist!`),
      onError: (error) => toast.error(`${error?.response?.data?.message}`),
      onSettled: () => setLoadingWishListId(null),
    });
  };

  const handleIncreaseQuantity = (productId, variantId) => {
    const idx = findItemIndex(productId, variantId);
    if (idx === -1) return;
    const newQty = cart[idx].quantity + 1;
    setCart((prev) =>
      prev.map((i, n) => (n === idx ? { ...i, quantity: newQty } : i)),
    );
    syncCart(productId, variantId, newQty);
  };

  const handleDecreaseQuantity = (productId, variantId) => {
    const idx = findItemIndex(productId, variantId);
    if (idx === -1) return;
    const newQty = Math.max(1, cart[idx].quantity - 1);
    setCart((prev) =>
      prev.map((i, n) => (n === idx ? { ...i, quantity: newQty } : i)),
    );
    syncCart(productId, variantId, newQty);
  };

  const handleRequestCartItemDelete = (item) => {
    setDeleteModalData(item); // store the full item
    setIsDeleteModalOpen(true); // open the modal
  };

  const handleRemoveCartItem = ({ productId, variantId }) => {
    setLoadingCartId(productId);
    deleteCartMutation.mutateAsync(
      { productId, variantId },
      {
        onSuccess: () =>
          setCart((prev) =>
            prev.filter(
              (i) =>
                i.product._id !== productId ||
                (i.variantId ?? null) !== (variantId ?? null),
            ),
          ),

        onError: () => toast.error("Failed to remove item"),
        onSettled: () => setLoadingCartId(null),
      },
    );
    setDeleteModalData(null);
    setIsDeleteModalOpen(false);
  };

  const handleGenerateCouponCode = () => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty! Add products to cart.");
      return;
    }
    couponMutation.mutateAsync({ data: { code: "code" } });
  };

  const handleToggleViewCart = () => {
    setViewCart((prev) => !prev);
  };

  /* ------------------ DATA STATUS ------------------ */

  const cartsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
    label: "Carts",
  });

  const wishListDataStatus = useFetchedDataStatusHandler({
    isLoading: isWishListLoading,
    isError: isWishListError,
    error: errorWishListData,
    label: "WishList",
  });

  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "Products",
  });

  const couponDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
    label: "Coupon",
  });

  /* ------------------ RETURN ------------------ */
  return {
    cart,
    addedToCart,
    wishList,
    addedToWishList,
    allProducts,
    loadingCartId,
    loadingWishListId,
    isDeleteModalOpen,
    coupons,
    viewCart,

    // Data fetched status
    cartsDataStatus,
    wishListDataStatus,
    productsDataStatus,
    couponDataStatus,
    deleteModalData,

    setDeleteModalData,

    hasVariants,
    getFirstVariant,
    isInCart,
    isInWishList,

    setCart,
    setWishList,
    setIsDeleteModalOpen,

    handleAddToCart,
    handleAddToWishList,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleGenerateCouponCode,
    handleRequestCartItemDelete,
    handleRemoveCartItem,
    handleToggleViewCart,
  };
};

export default useCart;
