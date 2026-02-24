import { useNavigate } from "react-router-dom";
import { HeartPlus, Loader, ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";

import Button from "../../common/components/ui/Button";
import CartItemList from "./components/CartItemList";
import CartSummaryPanel from "./components/CartSummaryPanel";
import Modal from "../../common/components/ui/Modal";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import PageMeta from "../../common/components/ui/PageMeta";
import textShortener from "../../utils/textShortener";
import { LucideIcon } from "../../common/lib/LucideIcons";
import useGlobalContext from "../../common/hooks/useGlobalContext";
import useRecentlyViewed from "../../common/hooks/useRecentlyViewed";
import CartItemSummaryPanel from "../../common/components/cartItemSummaryPanel/CartItemSummaryPanel";
import WishListSummaryPanel from "../../common/wishListItemSummaryPanel/WishListSummaryPanel";
const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ClientCartManagementPage = () => {
  const { addRecentlyViewed } = useRecentlyViewed();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [productId, setProductId] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [expandedModalId, setExpandedModalId] = useState(null);

  // central global hooks
  const {
    // Global States
    cart,
    wishList,
    allProducts,
    addedToCart,
    addedToWishList,
    deleteModalData,

    // Loaders and checkers
    loadingCartId,
    loadingWishListId,
    hasVariants,
    getFirstVariant,
    isInCart,
    isInWishList,

    // Setters
    setIsDeleteModalOpen,
    setDeleteModalData,

    // Handlers
    handleAddToCart,
    handleAddToWishList,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleGenerateCouponCode,
    handleRequestCartItemDelete,
    handleRemoveCartItem,
  } = useGlobalContext();

  const productItems = allProducts.map((item) => item.product);

  const CART_LIMIT = 10;
  const WISHLIST_LIMIT = 10;

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

  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${apiURL}${src.startsWith("/") ? src : `/${src}`}`;
  };

  const handleModalToggleView = (productId) => {
    addRecentlyViewed({ productId: productId });
    const item = productItems.find((i) => i._id === productId);
    setIsModalOpen(item);
  };

  const onGenerateCouponCode = () => {
    handleGenerateCouponCode();
    navigate("/client-cart-checkout");
  };

  const handleItemClick = (product) => {
    addRecentlyViewed({ productId: product._id });
    if (product?.variants?.length > 0) {
      navigate(`/product-details/${product?._id}`, {
        state: {
          from: "product",
          variantId: product?.variantId ?? null,
        },
      });
    }
  };

  /*** ------> Toggle read more and read less ------> */
  const handleToggleView = (product) => {
    setIsExpanded((prev) => !prev);
    setProductId(product._id);
  };

  return (
    <div className="lg:max-w-7xl mx-auto">
      <PageMeta
        title="Cart Management Page || Nova-Cart"
        description="Manage your cart and wishlist"
      />
      <DynamicPageTitle
        icon={<LucideIcon.ShoppingCart size={30} />}
        pageTitle="Cart Management"
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

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between">
        {/* ==========> LEFT PANEL ==========> */}
        <div className="lg:col-span-9 col-span-12 rounded-lg">
          {/* Top Controls */}
          <div className="flex justify-between items-center border border-base-content/20 rounded-t-lg w-full lg:p-1.5 p-1 bg-base-300">
            <div className="hidden lg:block">
              <h2 className="lg:text-xl text-lg font-extrabold flex items-center gap-2 uppercase">
                🛒 Nova{" "}
                <span className="text-green-500 lg:text-xl text-lg uppercase">
                  Cart
                </span>
              </h2>
            </div>
            <div className="flex items-center lg:justify-end justify-center lg:space-x-4 space-x-16">
              <Button
                href="/client-product-wishlist"
                variant="base"
                label="Wish List"
                size="xs"
                icon={HeartPlus}
                className=""
              />

              <Button
                onClick={onGenerateCouponCode}
                variant="indigo"
                label="Checkout"
                size="xs"
                icon={ShoppingCartIcon}
                className=""
              />
            </div>
          </div>

          {/* Cart Summary */}
          {addedToCart && addedToCart?.length > 0 && (
            <CartItemSummaryPanel addedToCart={addedToCart} />
          )}

          {/* Wishlist summary */}
          {addedToWishList && addedToWishList?.length > 0 && (
            <div className="">
              <WishListSummaryPanel addedToWishList={addedToWishList} />
            </div>
          )}

          {/* Cart Item List */}
          <div
            className={`${showSummary ? "hidden" : "block"} lg:my-3 rounded-lg lg:block`}
          >
            {cart?.length > 0 && (
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

          {/*-----> All Products-----> */}
          <div className="lg:space-y-2 space-y-2 lg:pt- mt-8">
            <div className="bg-base-300 p-2 rounded-t-lg">
              <h2 className="lg:text-2xl text-lg font-bold text-center gap-2 flex items-center justify-self-start text-base-content/70">
                🛒 Products
                <span className="w-7 h-7 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-sm">
                  {productItems?.length}
                </span>
              </h2>
            </div>
            <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-6 gap-4">
              {productItems?.map((product) => {
                const variant = getFirstVariant(product);
                const hasVariant = hasVariants(product);
                const inCart = isInCart(product?._id, variant?._id);
                const inWishlist = isInWishList(product?._id, variant?._id);

                return (
                  <div
                    key={product?._id}
                    className="border border-base-content/10 lg:p-2 p-2 rounded-lg shadow min-h-[360px] relative"
                  >
                    <div className="mb-2">
                      {product?.images && (
                        <img
                          onClick={() => handleItemClick(product)}
                          src={buildUrl(
                            variant?.images?.[0] || product?.images?.[0],
                          )}
                          alt={product?.name}
                          className="w-full h-32 object-contain bg-center p-2 mb-2 rounded-t-md cursor-pointer transition-transform duration-300 hover:scale-150 z-50"
                        />
                      )}
                    </div>

                    <div className="max-h-32 overflow-y-auto space-y-1 mb-3">
                      <h3
                        onClick={() => handleItemClick(product)}
                        className="font-semibold cursor-pointer"
                      >
                        {product?.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {isExpanded && productId === product?._id
                          ? product?.description
                          : textShortener(product?.description, 88)}

                        <button
                          onClick={() => handleToggleView(product)}
                          className="text-sm text-indigo-500 font-bold link ml-1"
                        >
                          {isExpanded && productId === product._id
                            ? "Read Less"
                            : "Read More"}
                        </button>
                      </p>

                      <p className="font-bold mt-1">
                        ${product?.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full left-0">
                      <div className="">
                        <Button
                          variant="success"
                          size="xs"
                          icon={LucideIcon.Eye}
                          label="View Details"
                          onClick={() => handleModalToggleView(product._id)}
                          className=" "
                        />
                      </div>

                      <div
                        className={`${
                          inCart
                            ? "cursor-not-allowed bg-pink-500 rounded-md opacity-50"
                            : cart?.length >= CART_LIMIT
                              ? "cursor-not-allowed bg-gray-600 rounded-b-md opacity-50"
                              : ""
                        }`}
                      >
                        <Button
                          size="xs"
                          onClick={() =>
                            variant
                              ? navigate(`/product-details/${product._id}`)
                              : handleAddToCart({
                                  product: product,
                                  variant: variant,
                                })
                          }
                          variant={
                            addedToCart.some((i) => i._id === product._id)
                              ? "base"
                              : "indigo"
                          }
                          disabled={inCart || cart?.length >= CART_LIMIT}
                          className={`btn btn-sm ${
                            inCart ? "cursor-not-allowed opacity-50" : ""
                          }`}
                        >
                          {loadingCartId === product._id ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <LucideIcon.ShoppingCart size={16} />
                          )}
                          {inCart
                            ? "In Cart"
                            : cart?.length >= CART_LIMIT
                              ? "Cart Full"
                              : "Add to Cart"}
                        </Button>
                      </div>
                    </div>

                    <div
                      className={`${
                        inWishlist
                          ? "cursor-not-allowed bg-pink-500 rounded-b-md opacity-50"
                          : wishList?.length >= WISHLIST_LIMIT
                            ? "cursor-not-allowed bg-base-300 rounded-b-md opacity-80"
                            : ""
                      } absolute bottom-0 left-0 right-0 w-full`}
                    >
                      <Button
                        onClick={() =>
                          handleAddToWishList({ product: product, variant })
                        }
                        variant="base"
                        disabled={
                          inWishlist || wishList.length >= WISHLIST_LIMIT
                        }
                        className={`btn btn-sm w-full border-none text-gray-600 rounded-t-none ${
                          inWishlist
                            ? "opacity-50 bg-red-600 text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {loadingWishListId === product._id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : inWishlist ? (
                          <LucideIcon.HeartPlus size={15} />
                        ) : (
                          <LucideIcon.Heart size={15} />
                        )}
                        {inWishlist
                          ? "In Wishlist"
                          : wishList.length >= WISHLIST_LIMIT
                            ? "Wishlist Full"
                            : "Add to Wishlist"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ==========> RIGHT PANEL ==========> */}
        <div className="lg:col-span-3 col-span-12">
          <div
            className={`
              ${showSummary ? "translate-y-0" : "translate-y-full"}
              lg:translate-y-0
              lg:sticky top-20
              fixed
              bottom-0 left-0 right-0
              transition-transform duration-300
              rounded-xl dark:bg-slate-900
              lg:z-40 z-50
            `}
          >
            <CartSummaryPanel
              cart={cart}
              handleGenerateCouponCode={onGenerateCouponCode}
            />

            {/* Close button (mobile only) */}
            <button
              onClick={() => setShowSummary(false)}
              className="lg:hidden w-full py-2 text-center text-base-100 bg-red-500 rounded-sm flex items-center justify-center gap-2"
            >
              <LucideIcon.FaTimesCircle /> Close Summary
            </button>
          </div>
        </div>

        {/* PRODUCT MODAL */}
        {isModalOpen && (
          <Modal
            isOpen={!!isModalOpen}
            onClose={() => setIsModalOpen(null)}
            title={isModalOpen.name || "Product Details"}
          >
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-4">
              {/* Image Section */}
              <div className="lg:col-span-4 col-span-12">
                <img
                  src={
                    isModalOpen?.images?.[0]
                      ? buildUrl(isModalOpen.images[0])
                      : "/placeholder.png"
                  }
                  alt={isModalOpen.name || "Product Image"}
                  className="w-full h-full object-contain rounded-lg shadow transition-all duration-300 transform hover:scale-140 cursor-pointer"
                />
              </div>

              {/* Info Section */}
              <div className="lg:col-span-8 col-span-12 overflow-y-auto max-h-56">
                <h3 className="text-lg font-semibold mb-2">
                  {isModalOpen.name || "Unnamed Product"}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  {expandedModalId === isModalOpen._id
                    ? isModalOpen.description
                    : textShortener(isModalOpen.description, 100)}
                  <button
                    onClick={() =>
                      setExpandedModalId(
                        expandedModalId === isModalOpen._id
                          ? null
                          : isModalOpen._id,
                      )
                    }
                    className="text-indigo-500 link ml-1 text-sm font-semibold"
                  >
                    {expandedModalId === isModalOpen._id
                      ? "Read Less"
                      : "Read More"}
                  </button>
                </p>

                <p className="font-bold text-xl">
                  $
                  {isModalOpen.price !== undefined
                    ? isModalOpen.price.toFixed(2)
                    : isModalOpen.variants?.length
                      ? Math.min(
                          ...isModalOpen.variants.map((v) => v.price),
                        ).toFixed(2)
                      : "0.00"}
                </p>

                {/* Buttons */}
                <div className="mt-4 space-x-2 flex items-center p-2">
                  <Button
                    icon={LucideIcon.ShoppingCart}
                    variant="indigo"
                    size="xs"
                    onClick={() => {
                      if (hasVariants(isModalOpen)) {
                        // Redirect to product details if variants exist
                        navigate(`/product-details/${isModalOpen._id}`);
                        return;
                      }
                      handleAddToCart({ product: isModalOpen });
                    }}
                    disabled={
                      addedToCart.some((i) => i._id === isModalOpen._id) ||
                      addedToCart.length >= CART_LIMIT
                    }
                    className=""
                  >
                    {addedToCart.some((i) => i._id === isModalOpen._id)
                      ? "In Cart"
                      : addedToCart.length >= CART_LIMIT
                        ? "Cart Full"
                        : "Add to Cart"}
                  </Button>

                  <Button
                    variant="danger"
                    size="xs"
                    icon={LucideIcon.X}
                    onClick={() => setIsModalOpen(null)}
                    className=""
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}

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

export default ClientCartManagementPage;
