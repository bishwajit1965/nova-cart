import { useNavigate } from "react-router-dom";
import Button from "../../common/components/ui/Button";
import { LucideIcon } from "../../common/lib/LucideIcons";
import useCart from "../../common/hooks/useCart";
import { ChevronLeft, ChevronRight, Loader, Package } from "lucide-react";
import { useRef } from "react";
import buildUrl from "../../common/hooks/useBuildUrl";

const ClientRelatedProducts = ({ relatedProducts }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const {
    cart,
    wishList,
    loadingCartId,
    loadingWishListId,
    hasVariants,
    getFirstVariant,
    isInCart,
    isInWishList,
    handleAddToCart,
    handleAddToWishList,
  } = useCart();

  const CART_LIMIT = 10;
  const WISHLIST_LIMIT = 10;

  const scroll = (direction = "right") => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({
      left: direction === "right" ? width / 2 : -width / 2,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-center bg-base-300 rounded-t-xl p-2 shadow border border-base-content/5 mb-2">
        <h2 className="lg:text-2xl text-[1rem] font-extrabold flex items-center justify-between lg:gap-2 gap-1">
          <Package className="mr-2" />
          Clients Also Chose
          <span className="bg-indigo-600 text-white w-7 h-7 flex items-center rounded-full justify-center p-2 ml-2 text-sm">
            {relatedProducts?.length || 0}
          </span>
        </h2>
      </div>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-50 lg:p-2 p-1 cursor-pointer bg-gray-700 text-white rounded-full hover:bg-gray-800"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-50 lg:p-2 p-1 cursor-pointer bg-gray-700 text-white rounded-full hover:bg-gray-800"
      >
        <ChevronRight />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin scrollbar-thumb-gray-400 min-h-[340px]"
      >
        {relatedProducts?.map((p) => {
          //🎯 Helper implementation
          const variant = getFirstVariant(p);
          const hasVariant = hasVariants(p);
          const inCart = isInCart(p?._id, variant?._id);
          const inWishlist = isInWishList(p?._id, variant?._id);

          return (
            <div
              key={p._id}
              className="lg:min-w-[240px] min-w-[295px] border border-base-content/15 rounded-md shadow hover:shadow-lg flex-shrink-0 relative"
            >
              <div className="bg-base-100 mb-2">
                <img
                  src={buildUrl(variant?.images?.[0] || p.images[0])}
                  alt={p.name}
                  className="h-32 w-full object-contain"
                />
              </div>
              <div className="p-2 space-y-2">
                <h3 className="text-md font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand}</p>
                <p className="text-sm font-bold">
                  {hasVariant
                    ? `$${variant.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : `From $${Math.min(
                        ...p.variants?.map((v) => v.price)
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row justify-between p-2">
                <Button
                  onClick={() => navigate(`/product-details/${p._id}`)}
                  variant="success"
                  icon={LucideIcon.Eye}
                  className="btn btn-sm"
                >
                  Details
                </Button>

                <div
                  className={`${
                    inCart
                      ? "cursor-not-allowed bg-pink-500 rounded-b-md opacity-50"
                      : cart?.length >= CART_LIMIT
                      ? "cursor-not-allowed bg-gray-600 rounded-b-md opacity-50"
                      : ""
                  }`}
                >
                  <Button
                    onClick={() =>
                      variant
                        ? navigate(`/product-details/${p._id}`)
                        : handleAddToCart({
                            product: p,
                            variant: variant,
                          })
                    }
                    // onClick={() =>
                    //   variant && handleAddToCart({ product: p, variant })
                    // }
                    disabled={inCart || cart?.length >= CART_LIMIT}
                    variant="indigo"
                    className={`btn btn-sm ${
                      inCart ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {loadingCartId === p._id ? (
                      <Loader className="animate-spin" />
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
                    ? "cursor-not-allowed bg-gray-600 rounded-b-md opacity-50"
                    : ""
                } absolute bottom-0 w-full `}
              >
                <Button
                  onClick={() =>
                    variant && handleAddToWishList({ product: p, variant })
                  }
                  disabled={inWishlist || wishList.length >= WISHLIST_LIMIT}
                  variant="base"
                  className={`btn btn-sm w-full border-none rounded-b-md rounded-t-none ${
                    inWishlist ? "opacity-50 bg-red-500 text-white" : ""
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
    </div>
  );
};

export default ClientRelatedProducts;
