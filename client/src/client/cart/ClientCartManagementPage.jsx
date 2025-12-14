import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CircleMinus,
  CirclePlus,
  HeartPlus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import CartItemList from "./components/CartItemList";
import CartSummaryPanel from "./components/CartSummaryPanel";
import ConfirmModal from "../../common/components/ui/ConfirmModal";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import Modal from "../../common/components/ui/Modal";
import PageMeta from "../../common/components/ui/PageMeta";
import textShortener from "../../utils/textShortener";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const ClientCartManagementPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const pageTitle = usePageTitle();
  const sectionTitle = "Client Cart Item Management";
  const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // all available products
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [wishList, setWishList] = useState([]);
  const [addedToWishList, setAddedToWishList] = useState([]);
  const [addedToCart, setAddedToCart] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteIdToken, setDeleteIdToken] = useState(null);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const CART_LIMIT = 10;
  const WISH_LIST_LIMIT = 10;

  /** ------> View product details in modal ------> */
  const handleModalToggleView = (productId) => {
    const item = allProducts.find((i) => i.product._id === productId);
    setIsModalOpen(item);
  };

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

  useEffect(() => {
    if (cartsData?.items) {
      setCart(cartsData?.items);
    } else {
      setCart([]);
    }
  }, [cartsData]);

  /*** ------> Add to Cart Mutation Query ------> */
  const addToCartMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    onSuccess: (res) => {
      setCart(res.data.items); // update cart with latest
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
      console.error(err);
    },
  });

  /*** ------> Add to wish-list ------> */
  const addToWishListMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT}`,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    onSuccess: (res) => {
      setWishList(res.data.items); // update cart with latest
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to add product to cart"
      );
      console.error(error);
    },
  });

  /*** -------> Coupon Mutation -------> */
  const couponMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT,
    key: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
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

  /** --------> Add product to cart --------> */
  const handleAddToCart = (product) => {
    if (addedToCart.length >= CART_LIMIT) {
      toast.error("Cart Full! Maximum 10 products allowed.");
      return;
    }
    addToCartMutation.mutate(
      {
        data: {
          productId: product._id,
          quantity: 1,
        },
      },
      {
        onSuccess: (res) => {
          setAddedToCart((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
              // update quantity
              return prev.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
              // toast.error("Item already added! try new one!");
            } else {
              return [
                ...prev,
                {
                  _id: product._id,
                  name: product.name,
                  brand: product.brand,
                  image: product.images?.[0], // first image
                  price: product.price,
                  quantity: 1,
                },
              ];
            }
          });
        },
      }
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

  /** ---> Increase cart product quantity ---> */
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

  /** --------> Decrease cart product quantity -------- */
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

  /** ----> Add product to wishlist handler ----> */
  const handleAddToWishlist = (product) => {
    if (addedToWishList.length >= WISH_LIST_LIMIT) {
      toast.error("Wishlist Full! Maximum 10 products allowed.");
      return;
    }

    addToWishListMutation.mutate(
      {
        data: { productId: product._id, quantity: 1 },
      },
      {
        onSuccess: (res) => {
          setWishList(res.data.items);
          setAddedToWishList((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
              // update quantity
              return prev.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              );
            } else {
              return [
                ...prev,
                {
                  _id: product._id,
                  name: product.name,
                  brand: product.brand,
                  image: product.images?.[0], // first image
                  price: product.price,
                  quantity: 1,
                },
              ];
            }
          });
        },
        onError: (error) => {
          console.error(error.message);
        },
      }
    );
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

  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "products",
  });

  const cartsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
    label: "cartsData",
  });

  const couponDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
    label: "Coupon",
  });

  return (
    <>
      {/* --------> Page Meta --------> */}
      <PageMeta
        title="Cart Management Page || Nova-Cart"
        description="You can palace items in cart."
      />

      <DynamicPageTitle pageTitle={pageTitle} />

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between">
        <div className="lg:col-span-9 col-span-12 rounded-lg">
          {/* -----> ALL PRODUCTS DISPLAYED -----> */}
          <div className="">
            <div className="flex justify-between items-center border border-base-content/20 rounded-t-lg w-full lg:p-1.5 p-1 bg-base-300">
              <div className="hidden lg:block">
                <h2 className="lg:text-xl text-lg font-extrabold flex items-center">
                  {wishList && (
                    <span className="flex items-center space-x-2">
                      🛒 Welcome to ➡️{" "}
                      <span className="text-purple-500 lg:text-xl text-lg uppercase">
                        Nova{" "}
                      </span>{" "}
                      <span className="text-green-500 lg:text-xl text-lg uppercase">
                        Cart
                      </span>
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center lg:justify-end justify-center lg:space-x-4 space-x-16">
                <div>
                  <Link to="/client-product-wishlist">
                    <Button variant="base" className="btn btn-sm">
                      <HeartPlus size={20} />
                      Wish List
                    </Button>
                  </Link>
                </div>
                <div>
                  <Button
                    onClick={handleGenerateCouponCode}
                    variant="indigo"
                    className="btn btn-sm"
                  >
                    <ShoppingCart size={20} />
                    Checkout
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:space-y-6 space-y-4 lg:py-4 py-2">
              {/*Added product limit to cart pop-up*/}
              {addedToCart.length > 0 && (
                <div className="rounded-xl shadow hover:shadow-md lg:p-4 p-2">
                  <div className="space-y-4">
                    <div className="text-base-content">
                      <h2 className="lg:text-2xl text-xl font-bold text-center">
                        🛒 Products Added to Cart Calculation Panel ➡️
                        <span className="w-10 h-10 rounded-full bg-white text-red-500">
                          {addedToCart.length}
                        </span>{" "}
                      </h2>
                    </div>
                    {addedToCart.length >= CART_LIMIT && (
                      <p className="text-xl text-red-600 text-center">
                        You have reached the limit of 10 products!!!
                      </p>
                    )}
                    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between bg-base-100 rounded-2xl lg:p-4 p-2">
                      {addedToCart?.map((c, idx) => (
                        <div className="lg:col-span-3 col-span-6" key={c._id}>
                          <div className="flex items-center flex-wrap p-2 border border-base-content/15 rounded-lg shadow space-y-2 min-h-20 space-x-2">
                            <div className="">
                              {c?.image && (
                                <img
                                  src={`${apiURL}${c?.image}`}
                                  alt={c?.brand}
                                  className="w-12 h-12 object-cover"
                                />
                              )}
                            </div>
                            <div className="">
                              <h2 className="font-bold text-sm">
                                {idx + 1} {") "}
                                {c?.brand}
                                {<br />}
                                ➡️
                                {c?.name}
                              </h2>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/*Added product limit to wish list pop-up*/}
              {addedToWishList?.length > 0 && (
                <div className="rounded-xl shadow hover:shadow-md lg:p-2 p-2">
                  <div className="space-y-4">
                    <div className="text-base-content">
                      <h2 className="lg:text-2xl text-lg font-bold text-center gap-2 flex items-center justify-center text-base-content/70">
                        🛒 Products Added to Wish List Calculation Panel ➡️
                        <span className="w-7 h-7 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-sm">
                          {addedToWishList?.length}
                        </span>
                      </h2>
                    </div>
                    {addedToWishList.length >= WISH_LIST_LIMIT && (
                      <p className="text-xl text-red-500 justify-center flex items-center gap-1 font-bold flex-wrap">
                        <AlertCircle /> You have reached the limit of 10
                        products !
                      </p>
                    )}
                    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between bg-base-100 rounded-2xl lg:p-4 p-2">
                      {addedToWishList?.map((c, idx) => (
                        <div className="lg:col-span-3 col-span-6" key={c._id}>
                          <div className="flex items-center flex-wrap p-2 border border-base-content/15 rounded-lg shadow space-y-2 min-h-20 space-x-2">
                            <div className="">
                              {c?.image && (
                                <img
                                  src={`${apiURL}${c?.image}`}
                                  alt={c?.brand}
                                  className="w-12 h-12 object-cover"
                                />
                              )}
                            </div>
                            <div className="">
                              <h2 className="font-bold text-sm">
                                {idx + 1} {") "}
                                {c?.brand}
                                {<br />}
                                ➡️
                                {c?.name}
                              </h2>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pr-4 pb-2 flex justify-end">
                      <Link to="/client-product-wishlist">
                        <Button variant="indigo">
                          <HeartPlus size={20} />
                          Go to Wish List
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* ------> CARTS LIST DATA DISPLAYED ------> */}
            <div className="lg:mb-10 mb-6">
              {/*------> Client cart item management ------> */}
              {cart.length > 0 && (
                <div className="lg:my- my-3 bg-base-200 p-2 rounded-t-lg">
                  <h2 className="lg:text-2xl text-xl font-extrabold flex items-center gap-2 text-base-content/70 m-0 p-0">
                    <span className="flex items-center gap-2">
                      <CirclePlus className="text-indigo-500" />{" "}
                      <CircleMinus className="text-green-500" />{" "}
                      <Trash2 className="text-red-500" />
                    </span>{" "}
                    ➡️ Manage Cart Items❓{" "}
                    <span className="w-7 h-7 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-sm">
                      {cart?.length}
                    </span>
                  </h2>
                </div>
              )}

              {cartsDataStatus.status !== "success" ? (
                cartsDataStatus.content
              ) : (
                <CartItemList
                  cart={cart}
                  handleIncreaseQuantity={handleIncreaseQuantity}
                  handleDecreaseQuantity={handleDecreaseQuantity}
                  onModalToggle={handleDeleteModalToggle}
                  modalOpen={setIsDeleteModalOpen}
                  setDeleteIdToken={setDeleteIdToken}
                  onSet={setProduct}
                />
              )}
            </div>
            <div className="lg:space-y-4 space-y-2 lg:pt-2">
              {productsDataStatus.status !== "success" ? (
                productsDataStatus.content
              ) : (
                <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-6 gap-4">
                  {allProducts.map((item) => (
                    <div
                      key={item.product._id}
                      className="border border-base-content/10 lg:p-3 p-2 rounded-lg border-b-none relative min-h-auto shadow"
                    >
                      <img
                        src={`${apiURL}${item.product.images[0]}`}
                        alt={item.product.name || ""}
                        className="h-36 object-contain w-full"
                      />

                      <div className="lg:min-h-44 min-h-40">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {textShortener(item.product.description, 68)}
                        </p>
                        <p className="font-bold mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 absolute bottom-11 space-x-4 w-full left-0 px-2">
                        <Button
                          variant="global"
                          size="sm"
                          icon={LucideIcon.Eye}
                          onClick={() =>
                            handleModalToggleView(item.product._id)
                          }
                          className="bg-base-content/5 outline-none"
                        >
                          View Details
                        </Button>
                        <div
                          className={`${
                            addedToCart.some(
                              (list) => list._id === item.product._id
                            )
                              ? "cursor-not-allowed rounded-b-none rounded-t-md bg-red-500 text-white"
                              : "rounded-t-md rounded-b-none"
                          }`}
                        >
                          <Button
                            onClick={() => {
                              const hasVariants =
                                item.product.variants &&
                                item.product.variants.length > 0;
                              if (hasVariants) {
                                toast.error(
                                  "Product has variants, please select from product page."
                                );
                                navigate(
                                  `/product-details/${item.product._id}`
                                );
                                return;
                              }

                              handleAddToCart(item.product);
                            }}
                            variant={`${
                              addedToCart.some(
                                (list) => list._id === item.product._id
                              )
                                ? "base"
                                : "indigo"
                            }`}
                            size="sm"
                            disabled={addedToCart.some(
                              (list) =>
                                list._id === item.product._id ||
                                addedToCart.length >= CART_LIMIT
                            )}
                            className={` ${
                              addedToWishList.some(
                                (list) => list._id === item.product._id
                              )
                                ? "w-full disabled cursor-not-allowed rounded-t-md rounded-b-none outline outline-base-content/5 bg-base-content/5 outline-none text-white"
                                : "w-full border-none rounded-t-md rounded-b-none outline-none text-white"
                            }`}
                          >
                            {addedToCart.some(
                              (list) => list._id === item.product._id
                            ) ? (
                              <LucideIcon.CircleCheckBig
                                size={20}
                                className=""
                              />
                            ) : (
                              <LucideIcon.ShoppingCart size={20} className="" />
                            )}
                            {addedToCart.some(
                              (list) => list._id === item.product._id
                            )
                              ? "Added"
                              : addedToCart.length >= CART_LIMIT
                              ? "Cart Full !!"
                              : "Add to Cart"}
                          </Button>
                        </div>
                      </div>
                      <div className="w-full absolute bottom-0 left-0 right-0 px-0 border-t border-base-content/20">
                        <div
                          className={`${
                            addedToWishList.some(
                              (list) => list._id === item.product._id
                            )
                              ? "cursor-not-allowed rounded-b-md bg-red-500 text-white"
                              : ""
                          }`}
                        >
                          <Button
                            variant={`${
                              addedToWishList.some(
                                (list) => list._id === item.product._id
                              )
                                ? "base"
                                : "base"
                            }`}
                            disabled={addedToWishList.some(
                              (list) =>
                                list._id === item.product._id ||
                                addedToWishList.length >= WISH_LIST_LIMIT
                            )}
                            size="sm"
                            onClick={() => handleAddToWishlist(item?.product)}
                            className={` ${
                              addedToWishList.some(
                                (list) => list._id === item.product._id
                              )
                                ? "w-full disabled cursor-not-allowed rounded-t-none rounded-b-md outline outline-base-content/5 bg-base-content/5 outline-none text-white"
                                : "w-full border-none rounded-b-md rounded-t-none outline-none"
                            }`}
                          >
                            {addedToWishList.some(
                              (list) => list._id === item.product._id
                            ) ? (
                              <LucideIcon.CircleCheckBig
                                size={20}
                                className=""
                              />
                            ) : (
                              <LucideIcon.Heart size={20} className="" />
                            )}
                            {addedToWishList.some(
                              (list) => list._id === item.product._id
                            )
                              ? "Added to Wish List"
                              : addedToWishList.length >= WISH_LIST_LIMIT
                              ? "Wish List Full"
                              : "Add to Wish List"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/*------> Client cart item management ------> */}
              {/* <div className="lg:my-10 my-3">
                <DynamicPageTitle pageTitle={sectionTitle} />
              </div> */}
            </div>
          </div>

          {/* ------> CARTS LIST DATA DISPLAYED ------> */}
          {/* {cartsDataStatus.status !== "success" ? (
            cartsDataStatus.content
          ) : (
            <CartItemList
              cart={cart}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleDecreaseQuantity={handleDecreaseQuantity}
              onModalToggle={handleDeleteModalToggle}
              modalOpen={setIsDeleteModalOpen}
              setDeleteIdToken={setDeleteIdToken}
              onSet={setProduct}
            />
          )} */}
        </div>

        {/* ------> RIGHT PANEL BEGINS ------> */}
        <div className="lg:col-span-3 col-span-12">
          <div className="sticky top-18">
            <div className="rounded-lg border border-base-content/15 shadow-sm">
              {cartsDataStatus.status !== "success" ? (
                cartsDataStatus.content
              ) : (
                <CartSummaryPanel
                  cart={cart}
                  handleGenerateCouponCode={handleGenerateCouponCode}
                  coupons={coupons}
                />
              )}
            </div>
          </div>
        </div>

        {/* ------> Modal panel begins ------> */}
        {isModalOpen && (
          <Modal
            isOpen={!!isModalOpen}
            onClose={() => setIsModalOpen(null)}
            title={isModalOpen.product.name}
          >
            <div className="">
              <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 items-center justify-between">
                <div className="lg:lg:col-span-4 col-span-12">
                  <img
                    src={`${apiURL}${isModalOpen?.product?.images[0]}`}
                    alt={isModalOpen.product.name}
                    className="w-full h-full object-cover rounded-lg shadow"
                  />
                </div>
                <div className="lg:col-span-8 col-span-12 overflow-y-auto max-h-56">
                  <h3 className="text-lg font-semibold mb-2">
                    {isModalOpen.product.name} || {isModalOpen.product.brand}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isExpanded
                      ? isModalOpen?.product?.description
                      : textShortener(isModalOpen?.product?.description, 200)}

                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-indigo-500 link ml-1 text-sm font-semibold"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  </p>
                  <p className="font-bold text-xl">
                    ${isModalOpen.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-x-3">
                <Button
                  icon={LucideIcon.ShoppingCart}
                  variant="indigo"
                  onClick={() => handleAddToCart(isModalOpen.product)}
                  disabled={
                    addedToCart.some(
                      (i) => i._id === isModalOpen.product._id
                    ) || addedToCart.length >= CART_LIMIT
                  }
                >
                  {addedToCart.length >= CART_LIMIT
                    ? "Cart Full"
                    : "Add to Cart"}
                </Button>

                <Button
                  variant="danger"
                  icon={LucideIcon.X}
                  onClick={() => setIsModalOpen(null)}
                  className="ml-2"
                >
                  {" "}
                  close
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Modal Toggle */}
        {isDeleteModalOpen && (
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            deleteIdToken={deleteIdToken}
            product={product}
            title="Remove item from cart ?"
            message={
              <>
                Do you really want to remove{" "}
                <span className="font-semibold text-red-600">{product}</span>{" "}
                from your cart?
              </>
            }
            cancelText="Keep"
            onConfirm={() => handleRemoveItem(deleteIdToken)}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ClientCartManagementPage;
