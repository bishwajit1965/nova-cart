import NoDataFound from "../components/ui/NoDataFound";

const WishListSummaryPanel = ({ addedToWishList }) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const WISHLIST_LIMIT = 10;
  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${apiURL}${src.startsWith("/") ? src : `/${src}`}`;
  };

  return (
    <div>
      {addedToWishList && addedToWishList.length > 0 ? (
        <div className="rounded-xl shadow hover:shadow-md lg:p-4 p-2 mb-10 bg-base-200">
          <div className="pb-2">
            <h2 className="lg:text-xl text-lg font-bold text-center flex items-center gap-2">
              🛒 Wishlist
              <span className="lg:w-5 lg:h-5 w-4 h-4 rounded-full bg-indigo-500 flex justify-center items-center text-white shadow text-xs">
                {addedToWishList?.length}
              </span>
            </h2>
            {addedToWishList.length >= WISHLIST_LIMIT && (
              <p className="text-xl text-red-500 flex justify-center items-center gap-1 font-bold">
                <AlertCircle /> Wishlist full!
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between bg-base-200 rounded-2xl">
            {addedToWishList &&
              addedToWishList?.length > 0 &&
              addedToWishList?.map((c, idx) => (
                <div className="lg:col-span-3 col-span-12 relative" key={c._id}>
                  <div className="grid lg:col-span-12 col-span-1 items-center justify-between gap-2 border border-base-content/15 rounded-xl p-2 shadow-sm">
                    <div className="flex items-center justify-between lg:gap-2 gap-1">
                      <div className="lg:col-span-3 col-span-12">
                        {c?.item.product?.images[0] && (
                          <img
                            src={buildUrl(c?.item?.product?.images[0])}
                            alt={c?.item?.product?.name}
                            className="w-full h-20 object-cover rounded-md transform transition-transform duration-300 hover:scale-130 cursor-pointer"
                          />
                        )}
                      </div>

                      <div className="lg:col-span-9 col-span-12 text-sm">
                        <p> {c?.item?.product?.name}</p>
                        <p> {c?.item?.product?.brand}</p>
                        <p>${c?.item?.product?.price.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1.5 left-1.5">
                    <div className="flex items-center justify-center w-4 h-4  rounded-full bg-emerald-500 text-white text-xs">
                      {idx + 1}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <NoDataFound label="Wish List" />
      )}
    </div>
  );
};

export default WishListSummaryPanel;
