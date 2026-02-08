import { Eye, Heart, ShoppingCartIcon } from "lucide-react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ConfirmDeleteModal from "../../common/components/ui/ConfirmDeleteModal";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Link, useNavigate } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import textShortener from "../../utils/textShortener";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import useGlobalContext from "../../common/hooks/useGlobalContext";
import { useEffect, useState } from "react";
import CartItemList from "./components/CartItemList";
import { motion } from "framer-motion";
import CartSummaryPanel from "./components/CartSummaryPanel";
import { FaCartPlus } from "react-icons/fa";

const WishListItemPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [isExpanded, setIsExpanded] = useState(false);
  const [productId, setProductId] = useState(null);
  const pageTitle = usePageTitle();
  const [addedToCart, setAddedToCart] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();

  const CART_LIMIT = 10;
  const wishlistIds = [];

  // Global cart data
  const {
    cart,
    viewCart,
    setCart,
    setDeleteModalData,
    cartsDataStatus,

    deleteModalData,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleRequestCartItemDelete,
    handleRemoveCartItem,
    handleToggleViewCart,
  } = useGlobalContext();

  // Esc btn hides cart summary panel
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setShowSummary(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Disables page scroll
  useEffect(() => {
    document.body.style.overflow = showSummary ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showSummary]);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  // --------> HANDLER TO DELETE WISH-LIST PRODUCT -------->
  const handleConfirmDelete = (productId, variantId) => {
    try {
      deleteWishListMutation.mutateAsync(
        { productId, variantId },
        {
          onSuccess: () => {},
          onError: (error) => {
            console.error(error);
          },
        },
      );
    } catch (error) {
      toast.error("Failed to delete wishlist product!");
      console.error(error);
    }
  };

  // ------> Fetch wish list items from the server ------>
  const {
    data: wishListData = [],
    isLoading: isLoadingWishList,
    isError: isErrorWishList,
    error: errorWishList,
  } = useApiQuery({
    url: API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT,
    queryKey: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  // Push all wishlist Ids to -> wishlistIds
  wishListData?.items?.map((item) => {
    wishlistIds.push(item?.product?._id);
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

  // ============> QUERY API MUTATIONS ============>
  const couponMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT,
    key: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const addToCartMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    onSuccess: (res) => {
      setCart(res.data.items); // update cart with latest
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

  const deleteWishListMutation = useApiMutation({
    method: "delete",
    path: ({ productId, variantId }) =>
      `${API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT}/${productId}/${variantId}`,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  // ---> Will move item to cart and delete from wishlist --->
  const handleMoveToCart = ({
    productId,
    variantId,
    name,
    brand,
    image,
    price,
  }) => {
    addToCartMutation.mutate(
      { data: { productId, variantId, quantity: 1 } }, // send variantId to backend
      {
        onSuccess: (res) => {
          setCart(res.data.items);

          setAddedToCart((prev) => {
            const existing = prev.find(
              (item) => item._id === productId && item.variantId === variantId,
            );
            if (existing) {
              return prev.map((item) =>
                item._id === productId && item.variantId === variantId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              );
            } else {
              return [
                ...prev,
                {
                  _id: productId,
                  variantId,
                  name,
                  brand,
                  image,
                  price,
                  quantity: 1,
                },
              ];
            }
          });

          deleteWishListMutation.mutate(
            { productId, variantId }, // send both for deletion
            {
              onSuccess: () => {},
              onError: (error) => {
                toast.error("Failed to remove from wishlist", error);
              },
            },
          );
        },
        onError: (err) => {
          console.error("Failed to move item to cart:", err);
          toast.error("Failed to move product to cart");
        },
      },
    );
  };

  /*** ------> Toggle read more and read less ------> */
  const handleToggleView = (product) => {
    setIsExpanded((prev) => !prev);
    setProductId(product._id);
  };

  // coupon generator handler
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

  /** ------> Use Fetched Data Status Handler ------> */
  const wishListStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingWishList,
    isError: isErrorWishList,
    error: errorWishList,
    label: "Wish List",
  });

  const couponDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
    label: "Coupon",
  });

  return (
    <div className="lg:max-w-7xl mx-auto">
      {/* --------> Meta Data --------> */}
      <PageMeta
        title="Wish List || Nova-Cart"
        description="You will see your wishlist items here."
      />
      <DynamicPageTitle
        icon={<LucideIcon.Heart size={30} />}
        pageTitle={pageTitle}
      />
      {/* Mobile Summary Toggle */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white dark:bg-slate-900 border-t">
        <button
          onClick={() => setShowSummary(true)}
          className="w-full py-2 font-semibold bg-emerald-600 text-white rounded-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <LucideIcon.ShoppingCart /> View Order Summary
          </span>
        </button>
      </div>
      {/*** --------> Wish list section --------> */}

      <div className="">
        <div className="lg:space-y- space-y-2">
          <div className="">
            <div className="bg-base-200 lg:py-10 py-4 rounded-lg shadow">
              <div className="text-center lg:space-y-3 space-y-2">
                <h2 className="lg:text-3xl text-xl font-bold text-green-500">
                  🛒You can add item to cart{" "}
                </h2>
                <p className="text-xs">
                  You can add item to cart from here as well OR land on to check
                  out cart page for placing order.
                </p>
              </div>
              <div className="lg:flex grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-2 justify-center lg:mt-8 mt-4 lg:space-x-6 space-x-0 w-full">
                <div className="lg:w-36">
                  <Link to="/client-cart-management" className="">
                    <Button
                      variant="successRounded"
                      className="btn lg:btn-md btn-sm lg:w-36 w-full"
                    >
                      <ShoppingCartIcon size={25} /> Shop Here
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-36">
                  <Link to="/client-cart-management">
                    <Button
                      variant="indigoRounded"
                      className="btn lg:btn-md btn-sm lg:w-36 w-full"
                    >
                      <FaCartPlus size={25} />
                      Your Cart
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-36 lg:hidden block">
                  <Button
                    onClick={handleToggleViewCart}
                    variant="primaryRounded"
                    className="btn lg:btn-md btn-sm lg:w-36 w-full"
                  >
                    <Eye />
                    {viewCart ? "Hide Cart" : "View cart"} <ShoppingCartIcon />
                  </Button>
                </div>
              </div>
            </div>

            {/* Added to cart limit display pop up panel */}
            <div className="lg:space-y-6 space-y-4 lg:py- py-4">
              {/*Added product limit to cart pop-up*/}
              {addedToCart.length > 0 && (
                <div className="rounded-xl shadow hover:shadow-md lg:p-4 p-2">
                  <div className="space-y-4">
                    <div className="text-base-content">
                      <h2 className="lg:text-2xl text-lg font-bold text-center flex items-center lg:gap-2">
                        🛒 Products Added to Cart ➡️
                        <span className="lg:w-7 lg:h-7 h-5 w-5 rounded-full bg-indigo-600 text-white text-sm flex justify-center items-center">
                          {addedToCart?.length}
                        </span>{" "}
                      </h2>
                    </div>
                    {addedToCart.length >= CART_LIMIT && (
                      <p className="text-xl text-red-600 text-center">
                        You have reached the limit of 10 products!!!
                      </p>
                    )}
                    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between bg-base-100 rounded-2xl lg:p-2 p-2">
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
            </div>

            <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-2">
              {/* ========> LEFT SIDEBAR -> Wish list items ========> */}
              <div className="lg:col-span-9 col-span-12 lg:space-y-4 space-y-2">
                {/* ------> CARTS LIST DATA DISPLAYED ------> */}

                <div
                  className={`${showSummary ? "hidden" : "block"} lg:my-3 rounded-lg lg:block`}
                  // className="lg:my-3 rounded-lg"
                >
                  {cartsDataStatus.status !== "success" ? (
                    cartsDataStatus.content
                  ) : (
                    <CartItemList
                      cart={cart}
                      handleIncreaseQuantity={handleIncreaseQuantity}
                      handleDecreaseQuantity={handleDecreaseQuantity}
                      deleteModalData={deleteModalData}
                      onDeleteRequest={handleRequestCartItemDelete}
                      onDelete={handleRemoveCartItem}
                      setDeleteModalData={setDeleteModalData}
                    />
                  )}
                </div>

                <div className="lg:mt-10 mt-5">
                  {wishListData?.items && wishListData?.items.length > 0 ? (
                    <div className="bg-base-300 p-2 rounded-t-lg border-b border-base-content/10 shadow-sm mb-2">
                      <h2 className="text-xl font-extrabold flex items-center gap-2">
                        <span className="flex items-center gap-2">
                          <Heart /> Wish List Products{" "}
                        </span>
                        <span className="w-6 h-6 rounded-full flex items-center bg-indigo-500 text-white justify-center shadow text-sm">
                          {wishListData?.items.length > 0
                            ? wishListData?.items.length
                            : 0}
                        </span>
                      </h2>
                    </div>
                  ) : (
                    <div className="">
                      <NoDataFound label="Wish List" />
                    </div>
                  )}

                  {wishListStatus.status !== "success" ? (
                    wishListStatus.content
                  ) : (
                    <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-2">
                      {wishListData?.items?.map((item) => {
                        const variant =
                          item.variantId && item.product?.variants
                            ? item.product.variants.find(
                                (v) => v._id === item.variantId,
                              )
                            : null;

                        return (
                          <div
                            key={item.product._id}
                            className="lg:col-span-4 col-span-12 border border-base-content/15 rounded-xl shadow-md bg-base-100 hover:shadow-xl relative"
                          >
                            <div className=" mb-4">
                              <img
                                src={`${apiURL}${
                                  variant?.images[0] ?? item.product.images[0]
                                }`}
                                alt={item.product.name}
                                className="w-full h-32 object-contain rounded mb-2"
                              />
                            </div>
                            <div className="lg:max-h-56 max-h-56 lg:p-4 p-2 overflow-y-auto lg:space-y-2">
                              <h3 className="lg:text-xl text-lg font-bold">
                                {item.product.name} || {item.product.brand}{" "}
                                <br />
                                {variant
                                  ? `(${variant.color || ""} / ${
                                      variant.size || ""
                                    })`
                                  : ""}
                              </h3>
                              <p className="mt-1 font-bold">
                                ${variant?.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {isExpanded && productId === item.product._id
                                  ? item.product.description
                                  : textShortener(item.product.description, 90)}

                                <button
                                  onClick={() => handleToggleView(item.product)}
                                  className="text-sm text-indigo-500 font-bold link ml-1"
                                >
                                  {isExpanded && productId === item.product._id
                                    ? "Read Less"
                                    : "Read More"}
                                </button>
                              </p>
                            </div>
                            <div className=" bottom-0 right-0 p-2 w-full flex justify-between items-center mb-8">
                              <Button
                                className="text-red-500 btn btn-sm"
                                variant="danger"
                                icon={LucideIcon.Trash2}
                                onClick={() =>
                                  handleDeleteClick(
                                    item.product,
                                    item.variantId,
                                  )
                                }
                              >
                                Remove
                              </Button>
                              {/* <Link to={`/product-details/${item.product._id}`}>
                                <Button
                                  variant="primary"
                                  className="btn btn-sm"
                                >
                                  <LucideIcon.Eye />
                                </Button>
                              </Link> */}
                              <Button
                                className="btn btn-sm"
                                variant="indigo"
                                icon={LucideIcon.ShoppingCart}
                                onClick={() =>
                                  handleMoveToCart({
                                    productId: item.product._id,
                                    variantId: item.variantId,
                                    name: item.product.name,
                                    brand: item.product.brand,
                                    image:
                                      variant?.images?.[0] ??
                                      item.product.images[0],
                                    price: variant?.price ?? item.product.price,
                                  })
                                }
                              >
                                Add to Cart
                              </Button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 w-full rounded-b-md">
                              <Link to={`/product-details/${item.product._id}`}>
                                <Button
                                  variant="base"
                                  className="btn btn-sm w-full rounded-t-none rounded-b-lg border-none"
                                >
                                  <LucideIcon.Eye /> View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* ========> RIGHT SIDEBAR ->  Cart summary panel ========>  */}
              <div
                className={`
                    ${showSummary ? "translate-y-0" : "translate-y-full"}
                    lg:translate-y-0
                    lg:sticky top-20
                    fixed
                    bottom-0 left-0 right-0
                    transition-transform duration-300
                    bg-white dark:bg-slate-900
                    lg:z-40 z-50
                    lg:col-span-3 col-span-12 lg:max-h-[34rem]
                    `}

                // className="lg:col-span-3 col-span-12 lg:max-h-[34rem] sticky top-20 lg:order-last order-first"
              >
                {viewCart && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-lg"
                  >
                    {cartsDataStatus.status !== "success" ? (
                      cartsDataStatus.content
                    ) : (
                      <CartSummaryPanel
                        cart={cart}
                        handleGenerateCouponCode={handleGenerateCouponCode}
                        coupons={coupons}
                      />
                    )}
                  </motion.div>
                )}

                {/* Close button (mobile only) */}
                <button
                  onClick={() => setShowSummary(false)}
                  className="lg:hidden w-full py-2 text-center text-base-100 bg-red-500 rounded-sm flex items-center justify-center gap-2"
                >
                  <LucideIcon.FaTimesCircle /> Close Summary
                </button>
              </div>
            </div>
          </div>

          {/* Delete Modal Toggler -> Delete wishlist data */}
          {deleteModalOpen && (
            <ConfirmDeleteModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={() =>
                handleConfirmDelete(itemToDelete?._id, itemToDelete?.variantId)
              }
              itemName={itemToDelete?.name}
            />
          )}
        </div>

        {/* Mobile Overlay */}
        {showSummary && (
          <div
            onClick={() => setShowSummary(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </div>
    </div>
  );
};

export default WishListItemPage;
