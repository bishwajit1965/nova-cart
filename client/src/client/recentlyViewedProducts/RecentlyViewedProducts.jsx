// src/client/components/recentlyViewed/RecentlyViewedProducts.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../common/hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../../common/components/ui/Button";
import { Package, ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { LucideIcon } from "../../common/lib/LucideIcons";
import useGlobalContext from "../../common/hooks/useGlobalContext";
import Modal from "../../common/components/ui/Modal";
import textShortener from "../../utils/textShortener";
import buildUrl from "../../common/hooks/useBuildUrl";
import StarRating from "../../common/components/ui/StartRating";

// LocalStorage helpers
export const getFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("recentlyViewedProducts");
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export const saveToLocalStorage = (productId) => {
  const existing = getFromLocalStorage();
  const filtered = existing.filter((id) => id !== productId);
  filtered.unshift(productId);
  localStorage.setItem(
    "recentlyViewedProducts",
    JSON.stringify(filtered.slice(0, 20)),
  );
};

const RecentlyViewedProducts = ({ viewedProducts, removeRecentlyViewed }) => {
  const { user } = useAuth();
  const { id: productId } = useParams();
  const [ids, setIds] = useState(getFromLocalStorage());
  const [modalProductId, setModalProductId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const {
    cart,
    wishList,
    hasVariants,
    getFirstVariant,
    isInCart,
    isInWishList,
    handleAddToCart,
    handleAddToWishList,
    loadingCartId,
    loadingWishListId,
  } = useGlobalContext();

  const CART_LIMIT = 10;
  const WISHLIST_LIMIT = 10;

  // Track product view in localStorage
  useEffect(() => {
    if (productId && user) {
      saveToLocalStorage(productId);
      setIds((prev) =>
        [productId, ...prev.filter((id) => id !== productId)].slice(0, 20),
      );
    }
  }, [productId]);

  // Listen for localStorage changes (optional)
  useEffect(() => {
    const handleStorageChange = () => setIds(getFromLocalStorage());
    window.addEventListener("recentlyViewedChange", handleStorageChange);
    return () =>
      window.removeEventListener("recentlyViewedChange", handleStorageChange);
  }, []);

  const modalProduct = viewedProducts?.find((p) => p._id === modalProductId);

  const onAddToCart = ({ product, variant }) => {
    handleAddToCart({ product: product, variant });
    removeRecentlyViewed({
      productId: (product?._id).toString(),
      variantId: variant?._id,
    });
    setModalProductId(null);
  };

  const handleModalToggleView = (id) => {
    const product = viewedProducts?.find((p) => p._id === id);
    if (!product) return;
    setModalProductId(id);
    setIsModalOpen(true);
  };

  const scroll = (direction = "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "right" ? width / 2 : -width / 2,
      behavior: "smooth",
    });
  };

  return (
    <motion.div className="relative">
      <>
        <div className="flex items-center justify-center bg-base-300 rounded-t-xl p-2 shadow border border-base-content/5">
          <h2 className="lg:text-2xl text-[1rem] font-extrabold flex items-center justify-between lg:gap-2 gap-1">
            <Package className="" />
            Your Viewed Products
            <span className="bg-indigo-600 text-white lg:w-7 lg:h-7 w-6 h-6 flex items-center rounded-full justify-center lg:text-sm text-xs">
              {viewedProducts?.length || 0}
            </span>
          </h2>
        </div>

        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 lg:p-2 p-1 cursor-pointer bg-gray-700 text-white rounded-full hover:bg-gray-800"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 lg:p-2 p-1 cursor-pointer bg-gray-700 text-white rounded-full hover:bg-gray-800"
        >
          <ChevronRight />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 p- scrollbar-thin scrollbar-thumb-gray-400 lg:min-h-[380px] min-h-[365px] py-2 "
        >
          {viewedProducts?.map((p) => {
            //🎯 Helper implementation
            const variant = getFirstVariant(p);
            const hasVariant = hasVariants(p);
            const inCart = isInCart(p?._id, variant?._id);
            const inWishlist = isInWishList(p?._id, variant?._id);

            return (
              <div
                key={p._id}
                className="lg:min-w-[243px] min-w-[295px] border border-base-content/15 rounded-md shadow hover:shadow-lg flex-shrink-0 relative"
              >
                <div className="bg-base-100 mb-2">
                  <img
                    src={buildUrl(variant?.images?.[0] || p?.images?.[0])}
                    alt={p.name}
                    className="w-full h-32 object-contain"
                  />
                </div>

                <div className="p-2 space-y-2">
                  <h3 className="text-lg font-semibold">
                    {textShortener(p?.name, 20)}
                  </h3>
                  <h4 className="text-sm text-gray-600">Brand: {p.brand}</h4>
                  <p className="text-sm font-bold">
                    {hasVariant
                      ? `$${variant.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : `From $${Math.min(
                          ...p.variants?.map((v) => v.price),
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </p>

                  <div className="text-medium font-bold">
                    <div className="flex items-center justify-between gap-1">
                      <span>
                        <span
                          className={` justify-items-end-safe${p?.rating === 0 ? "text-base-content/25" : "text-base-content/70"} `}
                        >
                          Rating:{" "}
                        </span>
                        <span
                          className={`${p?.rating === 0 ? "text-base-content/25" : "text-base-content/70"}`}
                        >
                          {p?.rating ?? 0}
                        </span>
                      </span>
                      <span>
                        <StarRating rating={p?.rating ?? 0} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-row justify-between p-2">
                  <div className="">
                    <Button
                      onClick={() => handleModalToggleView(p._id)}
                      variant="success"
                      size="xs"
                      icon={LucideIcon.Eye}
                      className="btn btn-sm"
                    >
                      Details
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
                      onClick={() => onAddToCart({ product: p, variant })}
                      disabled={inCart || cart?.length >= CART_LIMIT}
                      variant="indigo"
                      size="xs"
                      className={`btn btn-sm ${
                        inCart ? "!cursor-not-allowed opacity-50" : ""
                      }`}
                    >
                      {loadingCartId === p._id ? (
                        <Loader className="animate-spin" size={15} />
                      ) : (
                        <LucideIcon.ShoppingCart size={15} />
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
                      variant
                        ? navigate(`/product-details/${p._id}`)
                        : handleAddToWishList({ product: p, variant })
                    }
                    disabled={inWishlist || wishList.length >= WISHLIST_LIMIT}
                    variant="base"
                    size="xs"
                    className={`btn btn-sm w-full border-none rounded-b-md rounded-t-none text-gray-600 ${
                      inWishlist
                        ? "opacity-50 bg-red-500 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {loadingWishListId === p._id ? (
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

        {/* Modal */}
        {modalProduct && (
          <Modal
            isOpen={!!modalProduct}
            onClose={() => setModalProductId(null)}
            title={modalProduct.name}
          >
            <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 items-center">
              <div className="lg:col-span-4 col-span-12">
                <img
                  src={buildUrl(modalProduct.images[0])}
                  alt={modalProduct.name}
                  className="w-full h-full object-cover rounded-lg shadow"
                />
              </div>
              <div className="lg:col-span-8 col-span-12 overflow-y-auto max-h-56">
                <h3 className="text-lg font-semibold mb-2">
                  {modalProduct.name} || {modalProduct.brand}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {isExpanded
                    ? modalProduct.description
                    : textShortener(modalProduct.description, 110)}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-indigo-500 link ml-1 text-sm font-semibold"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                </p>
                <p className="font-bold text-xl">
                  $
                  {modalProduct.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 space-x-3 flex justify-end">
              <Button
                icon={LucideIcon.ShoppingCart}
                variant="indigo"
                onClick={() => {
                  const hasVariants = modalProduct.variants.length > 1;
                  setModalProductId(null);
                  if (hasVariants)
                    navigate(`/product-details/${modalProduct._id}`);
                  else
                    handleAddToCart({
                      product: modalProduct,
                      variant: modalProduct.variants[0],
                    });
                }}
                disabled={cart?.length >= CART_LIMIT}
                className={`btn btn-sm ${
                  cart?.length >= CART_LIMIT
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {cart?.length >= CART_LIMIT ? "Cart Full" : "Add to Cart"}
              </Button>

              <Button
                variant="danger"
                icon={LucideIcon.X}
                onClick={() => setModalProductId(null)}
                className="btn btn-sm"
              >
                Close
              </Button>
            </div>
          </Modal>
        )}
      </>
    </motion.div>
  );
};

export default RecentlyViewedProducts;
