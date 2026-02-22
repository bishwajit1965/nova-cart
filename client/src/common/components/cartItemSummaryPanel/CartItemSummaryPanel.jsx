import textShortener from "../../../utils/textShortener";
import NoDataFound from "../ui/NoDataFound";

const CartItemSummaryPanel = ({ addedToCart }) => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const CART_LIMIT = 10;

  const buildUrl = (src) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return `${apiURL}${src.startsWith("/") ? src : `/${src}`}`;
  };

  return (
    <div>
      {addedToCart && addedToCart?.length > 0 ? (
        <div className="rounded-b-xl shadow hover:shadow-md lg:p-4 p-2 mb-10 bg-base-200">
          <h2 className="lg:text-xl text-lg font-bold text-center flex items-center gap-2 mb-2">
            🛒 Cart
            <span className="lg:w-5 lg:h-5 w-4 h-4 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">
              {addedToCart?.length}
            </span>
          </h2>
          {addedToCart?.length >= CART_LIMIT && (
            <p className="text-xl text-red-600 text-center">
              You have reached the limit of {CART_LIMIT} products!
            </p>
          )}
          <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between bg-base-200 rounded-b-2xl">
            {addedToCart?.map((c, idx) => (
              <div className="lg:col-span-3 col-span-12 relative" key={c._id}>
                <div className="grid lg:col-span-12 col-span-1 items-center justify-between gap-2 border border-base-content/15 rounded-xl p-2 shadow-sm">
                  <div className="flex items-center justify-between lg:gap-2 gap-2">
                    <div className="lg:col-span-3 col-span-12">
                      {c?.item.image && (
                        <img
                          src={buildUrl(c?.item.image)}
                          alt={c?.item?.product?.name}
                          className="w-full h-20 object-cover rounded-md transform transition-transform duration-300 hover:scale-130 cursor-pointer"
                        />
                      )}
                    </div>

                    <div className="lg:col-span-9 col-span-12 text-sm">
                      <p className="font-bold capitalize">
                        {textShortener(c?.item?.product?.name, 10)}
                      </p>
                      <p className="">{c?.item.product?.brand}</p>
                      <p className="">${c?.item?.price.toFixed(2)}</p>

                      {c?.item?.color && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm capitalize">
                            {c?.item?.color ? `${c?.item?.color}` : ""}
                          </span>
                          <span
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{
                              backgroundColor: c?.item?.color,
                              borderColor: c?.item?.color,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-1.5 left-1.5">
                  <div className="flex items-center justify-center w-4 h-4  rounded-full bg-indigo-500 text-white text-xs">
                    {idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <NoDataFound label="Cart Item" />
      )}
    </div>
  );
};

export default CartItemSummaryPanel;
