import { CheckCircleIcon, ShoppingCartIcon } from "lucide-react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Link } from "react-router-dom";
import { LucideIcon } from "../../common/lib/LucideIcons";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import { useState } from "react";

const WishListItemPage = () => {
  const [cart, setCart] = useState([]);
  const pageTitle = usePageTitle();
  // ---------- Fetch wish list items from the server ----------
  const {
    data: wishListData,
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

  /** -------- Add to Cart Mutation Query -------- */
  const addToCartMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT}`,
    key: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
    onSuccess: (res) => {
      setCart(res.data.items); // update cart with latest
      toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
    },
  });

  console.log("Wish list data:", wishListData);

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

  // ------ Will move item to cart and delete from wishlist ------
  const handleMoveToCart = (productId) => {
    addToCartMutation.mutate(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: (res) => {
          setCart(res.data.items);
          toast.success("Product moved to cart");

          deleteWishListMutation.mutate(productId, {
            onSuccess: () =>
              toast.success("Item removed from wishlist successfully!"),
            onError: () => toast.error("Failed to remove from wishlist"),
          });
        },
        onError: (err) => {
          console.error("Failed to move item to cart:", err);
          toast.error("Failed to move product to cart");
        },
      }
    );
  };

  /** -------- Use Fetched Data Status Handler -------- */
  const wishListStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingWishList,
    isError: isErrorWishList,
    error: errorWishList,
    label: "wish List",
  });

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
                    <Button variant="global" className="">
                      <CheckCircleIcon size={25} />
                      Your Cart
                    </Button>
                  </Link>
                </div>
                <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-4 gap-2">
                  {wishListData?.items?.map((item) => (
                    <div
                      key={item.product._id}
                      className="lg:col-span-4 col-span-12 border border-base-content/15 rounded-xl p-4 shadow-md bg-base-100 relative lg:min-h-48"
                    >
                      <div className="lg:min-h-64 mb-4">
                        <p>{item.product._id}</p>
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="lg:h-64 object-cover rounded mb-2"
                        />
                      </div>
                      <div className="lg:min-h-36 min-h-36">
                        <h3 className="text-lg font-semibold">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.product.description}
                        </p>
                        <p className="mt-1 font-bold">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="absolute bottom-0 right-0 p-2 w-full flex justify-between items-center">
                        <Button
                          className="text-red-500"
                          variant="remove"
                          icon={LucideIcon.Trash2}
                          onClick={() => handleRemove(item.product._id)}
                        >
                          Remove
                        </Button>
                        <Button
                          className=""
                          variant="global"
                          icon={LucideIcon.ShoppingCart}
                          onClick={() => handleMoveToCart(item.product._id)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WishListItemPage;
