import { CheckCircleIcon, ShoppingCartIcon } from "lucide-react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import textShortener from "../../utils/textShortener";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const WishListItemPage = () => {
  const [cart, setCart] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [productId, setProductId] = useState(null);
  const pageTitle = usePageTitle();
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [addedToCart, setAddedToCart] = useState([]);
  const CART_LIMIT = 10;
  const wishlistIds = [];

  // ---------- Fetch wish list items from the server ----------
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

  /** -------- Add to Cart Mutation Query -------- */
  const addToCartMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    onSuccess: (res) => {
      setCart(res.data.items); // update cart with latest
      // toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

  const deleteWishListMutation = useApiMutation({
    method: "delete",
    path: (productId) =>
      `${API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT}/${productId}`,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  const handleRemove = (productId) => {
    try {
      if (window.confirm("Are you sure you want to delete this category?")) {
        deleteWishListMutation.mutate(productId, {
          onSuccess: () => {},
        });
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  // ------> Will move item to cart and delete from wishlist ------>
  const handleMoveToCart = (product) => {
    addToCartMutation.mutate(
      { data: { productId: product._id, quantity: 1 } },
      {
        onSuccess: (res) => {
          setCart(res.data.items);

          setAddedToCart((prev) => {
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

          deleteWishListMutation.mutate(product._id, {
            onSuccess: () => {},
            onError: (error) => {
              toast.error("Failed to remove from wishlist");
            },
          });
        },
        onError: (err) => {
          console.error("Failed to move item to cart:", err);
          toast.error("Failed to move product to cart");
        },
      }
    );
  };

  /** ------> Use Fetched Data Status Handler ------> */
  const wishListStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingWishList,
    isError: isErrorWishList,
    error: errorWishList,
    label: "wish List",
  });

  /*** ------> Toggle read more and read less ------> */
  const handleToggleView = (product) => {
    setIsExpanded(!isExpanded);
    setProductId(product._id);
  };

  return (
    <>
      {/* --------> Meta Data --------> */}
      <PageMeta
        title="Wish List || Nova-Cart"
        description="You will see your wishlist items here."
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      {/**--------> Wish list section --------> */}
      {wishListStatus.status !== "success" ? (
        wishListStatus.content
      ) : (
        <div className="lg:p-4">
          <div className="lg:space-y-3 space-y-2">
            {wishListData?.items?.length > 0 ? (
              <div className="">
                <div className="text-center lg:space-y-3 space-y-2">
                  <h2 className="lg:text-3xl text-xl font-bold text-green-500">
                    🛒You can add item to cart{" "}
                  </h2>
                  <p className="text-xs">
                    You can add item to cart from here as well OR land on to
                    check out cart page for placing order.
                  </p>
                </div>
                <div className="flex justify-center lg:my-8 my-4 lg:space-x-6 space-x-2">
                  <Link to="/client-cart-management">
                    <Button variant="global" className="">
                      <ShoppingCartIcon size={25} /> Shop Here
                    </Button>
                  </Link>
                  <Link to="/client-cart-management">
                    <Button variant="indigo" className="">
                      <CheckCircleIcon size={25} />
                      Your Cart
                    </Button>
                  </Link>
                </div>

                {/* Added to cart limit display pop up panel */}
                <div className="lg:space-y-6 space-y-4 lg:py-8 py-4">
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
                            <div
                              className="lg:col-span-3 col-span-6"
                              key={c._id}
                            >
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
                  {wishListData?.items?.map((item) => (
                    <div
                      key={item.product._id}
                      className="lg:col-span-3 col-span-12 border border-base-content/15 rounded-xl shadow-md bg-base-100 hover:shadow-xl"
                    >
                      <div className=" mb-4">
                        <img
                          src={`${apiURL}${item?.product?.images[0]}`}
                          alt={item.product.name}
                          className="w-full h-32 object-contain rounded mb-2"
                        />
                      </div>
                      <div className="lg:max-h-48 max-h-48 lg:p-4 p-2 overflow-y-auto lg:space-y-2">
                        <h3 className="lg:text-xl text-lg font-bold">
                          {item.product.name} || {item.product.brand}
                        </h3>
                        <p className="mt-1 font-bold">
                          ${item.product.price.toFixed(2)}
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
                      <div className=" bottom-0 right-0 p-2 w-full flex justify-between items-center">
                        <Button
                          className="text-red-500 btn btn-sm"
                          variant="danger"
                          icon={LucideIcon.Trash2}
                          onClick={() => handleRemove(item.product._id)}
                        >
                          Remove
                        </Button>
                        <Link to={`/product-details/${item.product._id}`}>
                          <Button variant="base" className="btn btn-sm">
                            <LucideIcon.Eye />
                          </Button>
                        </Link>
                        <Button
                          className="btn btn-sm"
                          variant="indigo"
                          icon={LucideIcon.ShoppingCart}
                          onClick={() => handleMoveToCart(item.product)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoDataFound label={"Products"} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WishListItemPage;
