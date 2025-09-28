import API_PATHS from "../services/apiPaths/apiPaths";
import CartItemList from "../components/CartItemList";
import CartSummaryPanel from "../components/CartSummaryPanel";
import toast from "react-hot-toast";
import { useApiMutation } from "../services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const CartManagementPage = () => {
  const [cart, setCart] = useState([]);

  /** -----> Fetch Products Query ---> */
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.PRODUCTS.ENDPOINT,
    queryKey: API_PATHS.PRODUCTS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /** -----> Fetch Carts Query ---> */
  const {
    data: cartsData,
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
  } = useApiQuery({
    url: API_PATHS.CARTS.ENDPOINT,
    queryKey: API_PATHS.CARTS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("Carts data=>", cartsData);

  /** -----> Initialize Cart with Products ---> */
  useEffect(() => {
    if (products) {
      const initialCart = products?.map((prod) => ({
        product: prod,
        quantity: 1, //default quantity=1
      }));
      setCart(initialCart);
    }
  }, [products]);

  useEffect(() => {
    if (cartsData?.items) {
      setCart(cartsData.items);
    }
  }, [cartsData]);

  /** -----> Update cart data ---> */
  const cartMutation = useApiMutation({
    method: "update",
    path: (payload) => `${API_PATHS.CARTS.ENDPOINT}/${payload.productId}`,
    key: API_PATHS.CARTS.KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error saving permission");
      console.error(error);
    },
  });

  /** ------> Delete cart order mutation ----> */
  const deleteCartMutation = useApiMutation({
    method: "delete",
    path: (productId) => `${API_PATHS.CARTS.ENDPOINT}/${productId}`,
    key: API_PATHS.CARTS.KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  console.log("cart", cart);

  /** ------> Update cart product quantity ----> */
  const updateQuantity = (productId, newQty) => {
    const payload = { data: { productId, quantity: newQty } };
    console.log("PayLoad", payload);
    cartMutation.mutate(payload, {
      onSuccess: (res) => {
        console.log("Response", res.data.items);
        setCart(res.data.items); // backend returns { success, data: cart }
      },
      onError: (err) => {
        console.error("Failed to update quantity:", err);
        toast.error("Failed to update quantity");
      },
    });
  };

  /** ------> Increase cart product quantity ----> */
  const handleIncreaseQuantity = (productId) => {
    const updatedCart = cart?.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCart(updatedCart);
    updateQuantity(
      productId,
      updatedCart.find((i) => i.product._id === productId).quantity
    );
  };

  /** ------> Decrease cart product quantity ----> */
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

  /** ------> Remove Product from cart ----> */
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

  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  });
  const cartDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCartsData,
    isError: isErrorCartsData,
    error: errorCartsData,
  });

  console.log("Products", products);
  // if (isLoading || isCartLoading) return <p>Loading cart...</p>;
  // if (isError || isCartError) return <p>Error loading cart.{error.message}</p>;
  // if (isCartError) return <p>Error loading c arts.{cartError.message}</p>;

  return (
    <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-2 justify-between">
      {/*-----> Left / Main Area ----->*/}
      <div className="lg:col-span-9 col-span-12 rounded-lg shadow min-h-48 bg-base-100">
        {productsDataStatus.status !== "success" ? (
          productsDataStatus.content
        ) : (
          <CartItemList
            products={products}
            cart={cart}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleRemoveItem={handleRemoveItem}
          />
        )}
      </div>

      {/*-----> Right Sidebar----->*/}
      <div className="lg:col-span-3 col-span-12 rounded-lg shadow min-h-48 bg-base-100">
        {cartDataStatus.status !== "success" ? (
          cartDataStatus.content
        ) : (
          <CartSummaryPanel cart={cart} />
        )}
      </div>
    </div>
  );
};

export default CartManagementPage;
