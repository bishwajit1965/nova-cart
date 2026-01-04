import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, HeartPlus, Loader, ShoppingCart } from "lucide-react";
import { useState } from "react";

import Button from "../../common/components/ui/Button";
import CartItemList from "./components/CartItemList";
import CartSummaryPanel from "./components/CartSummaryPanel";
import Modal from "../../common/components/ui/Modal";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import PageMeta from "../../common/components/ui/PageMeta";
import textShortener from "../../utils/textShortener";
import { LucideIcon } from "../../common/lib/LucideIcons";
import useGlobalContext from "../../common/hooks/useGlobalContext";
const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const ClientCartManagementPage = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(null);
  const [productId, setProductId] = useState(null);

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
  console.log("Product Items", productItems);
  console.log("Added to cart", addedToCart);
  console.log("Added to wishlist", addedToWishList);

  const CART_LIMIT = 10;
  const WISH_LIST_LIMIT = 10;

  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${apiURL}${src.startsWith("/") ? src : `/${src}`}`;
  };

  const handleModalToggleView = (productId) => {
    const item = productItems.find((i) => i._id === productId);
    setIsModalOpen(item);
  };

  const onGenerateCouponCode = () => {
    handleGenerateCouponCode();
    navigate("/client-cart-checkout");
  };

  const handleItemClick = (product) => {
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
    <>
      <PageMeta
        title="Cart Management Page || Nova-Cart"
        description="Manage your cart and wishlist"
      />
      <DynamicPageTitle
        icon={<LucideIcon.ShoppingCart size={30} />}
        pageTitle="Cart Management"
      />

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
              <Link to="/client-product-wishlist">
                <Button variant="base" className="btn btn-sm">
                  <HeartPlus size={20} />
                  Wish List
                </Button>
              </Link>
              <Button
                onClick={onGenerateCouponCode}
                variant="indigo"
                className="btn btn-sm"
              >
                <ShoppingCart size={20} />
                Checkout
              </Button>
            </div>
          </div>

          {/* Cart Summary */}
          {addedToCart.length > 0 && (
            <div className="rounded-xl shadow hover:shadow-md lg:p-4 p-2 mb-10">
              <h2 className="lg:text-2xl text-xl font-bold text-center flex items-center gap-2 mb-2">
                🛒 Cart ➡️
                <span className="lg:w-7 lg:h-7 w-6 h-6 rounded-full bg-indigo-600 text-white text-sm flex items-center justify-center">
                  {addedToCart?.length}
                </span>
              </h2>
              {addedToCart?.length >= CART_LIMIT && (
                <p className="text-xl text-red-600 text-center">
                  You have reached the limit of {CART_LIMIT} products!
                </p>
              )}
              <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-3 gap-2 justify-between bg-base-100 rounded-2xl">
                {addedToCart?.map((c, idx) => (
                  <div className="lg:col-span-3 col-span-12" key={c._id}>
                    <div className="flex items-center flex-wrap p-2 border border-base-content/15 rounded-lg shadow space-y-2 min-h-20 space-x-2">
                      <div className="">
                        {c?.item.image && (
                          <img
                            src={buildUrl(c?.item.image)}
                            alt={c?.item?.product?.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                      </div>

                      <div className="font-bold text-sm">
                        <p>
                          {idx + 1} {") "}${c?.item?.price.toFixed(2)}
                        </p>
                        <p>➡️ {c?.item.name}</p>
                        <p>➡️ {c?.item.product?.brand}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wishlist Summary */}
          {addedToWishList.length > 0 && (
            <div className="rounded-xl shadow hover:shadow-md lg:p-3 p-2 mb-10">
              <div className="pb-2">
                <h2 className="lg:text-2xl text-lg font-bold text-center flex items-center gap-2">
                  🛒 Wishlist ➡️
                  <span className="w-7 h-7 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-sm">
                    {addedToWishList.length}
                  </span>
                </h2>
                {addedToWishList.length >= WISH_LIST_LIMIT && (
                  <p className="text-xl text-red-500 flex justify-center items-center gap-1 font-bold">
                    <AlertCircle /> Wishlist full!
                  </p>
                )}
              </div>

              <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-3 gap-2 justify-between bg-base-100 rounded-2xl">
                {addedToWishList?.map((c, idx) => (
                  <div className="lg:col-span-3 col-span-12" key={c._id}>
                    <div className="flex items-center flex-wrap p-2 border border-base-content/15 rounded-lg shadow space-y-2 min-h-20 space-x-2">
                      <div className="">
                        {c?.item.product.images[0] && (
                          <img
                            src={buildUrl(c?.item.product.images[0])}
                            alt={c?.item?.product?.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        )}
                      </div>

                      <div className="font-bold text-sm">
                        <p>
                          {idx + 1} {") "}${c?.item?.product.price.toFixed(2)}
                        </p>
                        <p>➡️ {c?.item.product.name}</p>
                        <p>➡️ {c?.item.product?.brand}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cart Item List */}
          {cart?.length > 0 && (
            <div className="lg:my-3 rounded-lg">
              <CartItemList
                cart={cart}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                deleteModalData={deleteModalData}
                onDeleteRequest={handleRequestCartItemDelete}
                onDelete={handleRemoveCartItem}
                setDeleteModalData={setDeleteModalData}
              />
            </div>
          )}

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
                    key={product._id}
                    className="border border-base-content/10 lg:p-2 p-2 rounded-lg shadow min-h-[360px] relative"
                  >
                    <div className="mb-2">
                      <img
                        onClick={() => handleItemClick(product)}
                        src={buildUrl(
                          variant?.images?.[0] || product?.images?.[0]
                        )}
                        // src={product?.images?.[0]}

                        alt={product.name}
                        className="h-32 object-contain w-full cursor-pointer z-50"
                      />
                    </div>

                    <div className="max-h-32 overflow-y-auto space-y-1 mb-3">
                      <h3
                        onClick={() => handleItemClick(product)}
                        className="font-semibold cursor-pointer"
                      >
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {isExpanded && productId === product._id
                          ? product.description
                          : textShortener(product.description, 95)}

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

                    <div className="flex items-center justify-between mt- w-full left-0">
                      <div className="">
                        <Button
                          variant="success"
                          icon={LucideIcon.Eye}
                          onClick={() => handleModalToggleView(product._id)}
                          className="btn btn-sm border-none"
                        >
                          View Details
                        </Button>
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
                            <LucideIcon.ShoppingCart size={20} />
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
                          : ""
                      } absolute bottom-0 left-0 right-0 w-full`}
                    >
                      <Button
                        onClick={() =>
                          handleAddToWishList({ product: product, variant })
                        }
                        variant="base"
                        disabled={inWishlist}
                        size="sm"
                        className={`btn btn-sm w-full mt-1 border-none ${
                          inWishlist ? "opacity-50 bg-red-500 text-white" : ""
                        }`}
                      >
                        {loadingWishListId === product._id ? (
                          <Loader className="animate-spin" size={16} />
                        ) : inWishlist ? (
                          <LucideIcon.HeartPlus size={16} />
                        ) : (
                          <LucideIcon.Heart size={16} />
                        )}
                        {inWishlist ? "In Wishlist" : "Add to Wishlist"}
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
          <div className="sticky top-18">
            <CartSummaryPanel
              cart={cart}
              handleGenerateCouponCode={onGenerateCouponCode}
            />
          </div>
        </div>

        {/* PRODUCT MODAL */}
        {isModalOpen && (
          <Modal
            isOpen={!!isModalOpen}
            onClose={() => setIsModalOpen(null)}
            title={isModalOpen.name}
          >
            <div className="grid lg:grid-cols-12 grid-cols-1 gap-4">
              <div className="lg:col-span-4 col-span-12">
                <img
                  src={buildUrl(isModalOpen?.images?.[0])}
                  // src={isModalOpen?.images?.[0]}
                  alt={isModalOpen.name}
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              </div>
              <div className="lg:col-span-8 col-span-12 overflow-y-auto max-h-56">
                <h3 className="text-lg font-semibold mb-2">
                  {isModalOpen.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {isExpanded
                    ? isModalOpen.description
                    : textShortener(isModalOpen.description, 100)}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-indigo-500 link ml-1 text-sm font-semibold"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                </p>
                <p className="font-bold text-xl">
                  ${isModalOpen.price.toFixed(2)}
                </p>

                <div className="mt-4 space-x-2 flex items-center">
                  <Button
                    icon={LucideIcon.ShoppingCart}
                    variant="indigo"
                    onClick={() => handleAddToCart(isModalOpen)}
                    disabled={
                      addedToCart.some((i) => i._id === isModalOpen._id) ||
                      addedToCart.length >= CART_LIMIT
                    }
                    className="btn btn-sm"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="danger"
                    icon={LucideIcon.X}
                    onClick={() => setIsModalOpen(null)}
                    className="btn btn-sm ml-2"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ClientCartManagementPage;
