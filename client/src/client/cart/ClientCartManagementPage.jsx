import { Link, useNavigate } from "react-router-dom";
import { ListCheck, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import CartItemList from "./components/CartItemList";
import CartSummaryPanel from "./components/CartSummaryPanel";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import Modal from "../../common/components/ui/Modal";
import PageMeta from "../../common/components/ui/PageMeta";
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

  const navigate = useNavigate();

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

  console.log("Coupon", coupons);

  useEffect(() => {
    if (cartsData?.items) {
      setCart(cartsData.items);
    } else {
      setCart([]);
    }
    console.log("Cart State:", cart);
  }, [cartsData, cart]);

  /*** ------> Add to Cart Mutation Query ------> */
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

  /*** ------> Add to wish-list ------> */
  const addToWishListMutation = useApiMutation({
    method: "create",
    path: `${API_PATHS.CLIENT_WISH_LISTS.CLIENT_WISH_LIST_ENDPOINT}`,
    key: API_PATHS.CLIENT_WISH_LISTS.CLIENT_KEY,
    onSuccess: (res) => {
      setWishList(res.data.items); // update cart with latest
      toast.success("Product added to cart");
    },
    onError: (err) => {
      toast.error("Failed to add product to cart");
      console.error(err);
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
    addToCartMutation.mutate({
      data: {
        productId: product._id,
        quantity: 1,
      },
    });
  };

  /** --------> Update cart product quantity --------> */
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

  /** --------> Increase cart product quantity --------> */
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

  /** --------> Add product to wishlist handler -------- */
  const handleAddToWishlist = (productId) => {
    addToWishListMutation.mutate(
      {
        data: { productId },
      },
      {
        onSuccess: (res) => {
          setWishList(res.data.items);
          toast.success("Product added to wishlist");
        },
        onError: (err) => {
          toast.error("Failed to add product to wishlist");
          console.error(err);
        },
      }
    );
  };

  /** --------> Remove product from cart -------- */
  const handleRemoveItem = async (productId) => {
    try {
      if (window.confirm("Are you sure you want to delete this category?")) {
        deleteCartMutation.mutate(productId, {
          onSuccess: () => {},
        });
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      toast.error("Failed to remove item");
    }
  };

  /*** ------> handle generate coupon code ------> */
  const handleGenerateCouponCode = (e) => {
    e?.preventDefault();
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
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-12 gap-2 justify-between">
        <div className="lg:col-span-9 col-span-12 rounded-lg">
          {/* -----> ALL PRODUCTS DISPLAYED -----> */}
          <div className="">
            <div className="flex justify-between items-center border border-base-content/20 rounded-t-lg w-full lg:p-4 p-2 bg-base-200">
              <div className="">
                <h2 className="lg:text-2xl text-lg font-bold hidden lg:visible">
                  {wishList && <span>Welcome to - &nbsp;</span>}
                  Nova-Cart
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                <span>
                  <Link to="/client-product-wishlist">
                    <Button variant="global" className="lg:text-xl font-bold">
                      <ListCheck size={20} />
                      Wish List
                    </Button>
                  </Link>
                </span>
                <span>
                  <Button
                    onClick={handleGenerateCouponCode}
                    variant="indigo"
                    className="lg:text-xl font-bold"
                  >
                    <ShoppingCart size={20} />
                    Checkout
                  </Button>
                </span>
              </div>
            </div>

            <div className="lg:space-y-4 space-y-2 pt-6">
              {productsDataStatus.status !== "success" ? (
                productsDataStatus.content
              ) : (
                <div className="grid lg:grid-cols-3 grid-cols-1 lg:gap-6 gap-4">
                  {allProducts.map((item) => (
                    <div
                      key={item.product._id}
                      className="border border-base-content/10 lg:p-3 rounded-lg border-b-none relative min-h-auto shadow"
                    >
                      {item.product?.image ? (
                        <img
                          src={
                            item.product?.image
                              ? item.product.image
                              : item.product.images[0]
                          }
                          alt={item.product?.name}
                          className="h-36 object-contain w-full"
                        />
                      ) : (
                        item.product.images[0] && (
                          <img
                            src={`${apiURL}${
                              item.product.images[0].startsWith("/") ? "" : "/"
                            }${item.product.images[0]}`}
                            alt={item.product.name || ""}
                            className="h-36 object-contain w-full"
                          />
                        )
                      )}
                      <div className="lg:min-h-44 min-h-40">
                        <h3 className="font-semibold">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">
                          {item.product.description}
                        </p>
                        <p className="font-bold mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-2 absolute bottom-11 space-x-4 w-full left-0">
                        <Button
                          variant="global"
                          icon={LucideIcon.Eye}
                          onClick={() =>
                            handleModalToggleView(item.product._id)
                          }
                          className="bg-base-content/5 outline-none"
                        >
                          View Details
                        </Button>
                        <Button
                          icon={LucideIcon.ShoppingCart}
                          variant="indigo"
                          onClick={() => handleAddToCart(item.product)}
                          className="bg-base-content/5 outline-none"
                        >
                          Add to Cart
                        </Button>
                      </div>
                      <div className="w-full absolute bottom-0 left-0 right-0 px-0 border-t border-base-content/20">
                        <Button
                          variant="global"
                          icon={LucideIcon.Heart}
                          size="sm"
                          onClick={() => handleAddToWishlist(item.product._id)}
                          className="w-full rounded-t-none rounded-b-lg outline outline-base-content/5 bg-base-content/5 outline-none"
                        >
                          Add to Wishlist
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/*------> Client cart item management ------> */}
              <div className="lg:my-10 my-3">
                <DynamicPageTitle pageTitle={sectionTitle} />
              </div>
            </div>
          </div>

          {/* ------> CARTS LIST DATA DISPLAYED ------> */}
          {cartsDataStatus.status !== "success" ? (
            cartsDataStatus.content
          ) : (
            <CartItemList
              cart={cart}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleDecreaseQuantity={handleDecreaseQuantity}
              handleRemoveItem={handleRemoveItem}
            />
          )}
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
              <div className="flex flex-row items-center">
                <div className="lg:w-32 w-16 lg:h-auto h-auto mr-4">
                  <img
                    src={isModalOpen.product.image}
                    alt={isModalOpen.product.name}
                    className="w-full h-full object-cover rounded-lg shadow"
                  />
                </div>
                <div className="">
                  <h3 className="text-lg font-semibold mb-2">
                    {isModalOpen.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isModalOpen.product.description}
                  </p>
                  <p className="font-bold text-xl">
                    ${isModalOpen.product.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-x-3">
                <Button
                  icon={LucideIcon.ShoppingCart}
                  variant="global"
                  onClick={() => handleAddToCart(isModalOpen.product)}
                >
                  Add to Cart
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
      </div>
    </>
  );
};

export default ClientCartManagementPage;
