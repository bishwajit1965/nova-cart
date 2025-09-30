import { ArrowLeftCircleIcon, CreditCardIcon } from "lucide-react";
import { useEffect, useState } from "react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import CheckOutItemList from "./components/CheckOutItemList";
import CheckOutSummaryPanel from "./components/CheckOutSummaryPanel";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { FaAddressCard } from "react-icons/fa";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useAuth } from "../../common/hooks/useAuth";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const CheckOutPage = () => {
  const { user } = useAuth();
  const userId = user?._id;

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const pageTitle = usePageTitle();
  const navigate = useNavigate();

  /** --------> Cart State --------> */
  const [cartItems, setCartItems] = useState([]);

  /** --------> Shipping & Payment --------> */
  const [paymentMethod, setPaymentMethod] = useState("COD");

  /** --------> Address State --------> */
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isNewAddressForm, setIsNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    isDefault: true,
  });

  /** --------> Fetch Cart --------> */
  const {
    data: cartsData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useApiQuery({
    url: API_PATHS.CLIENT_CARTS.CLIENT_ENDPOINT,
    queryKey: API_PATHS.CLIENT_CARTS.CLIENT_KEY,
  });

  /*** -------> Fetch Coupon Query -------> */
  const {
    data: coupons,
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
  } = useApiQuery({
    url: `${API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT} `,
    queryKey: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (cartsData?.items) setCartItems(cartsData.items);
  }, [cartsData]);

  /** --------> Fetch orders --------> */
  const {
    data: savedOrdersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT,
    queryKey: [API_PATHS.CLIENT_ORDERS.CLIENT_KEY, userId],
    enabled: !!userId,
  });

  /** --------> Fetch addresses --------> */
  const {
    data: addressData,
    isLoading: isAddressLoading,
    isError: isAddressError,
    error: addressError,
  } = useApiQuery({
    url: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_ENDPOINT,
    queryKey: API_PATHS.CLIENT_ADDRESS.CLIENT_ADDRESS_KEY,
  });

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData);
      const defaultAddr = addressData.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (addressData.length === 0) {
        setIsNewAddressForm(true); // no saved addresses → show form
      }
    }
  }, [addressData]);

  /*** -------> FORM INPUT HANDLER ------>  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /*** -------> Order Mutation -------> */
  const orderMutation = useApiMutation({
    method: "create",
    path: API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT,
    key: API_PATHS.CLIENT_ORDERS.CLIENT_KEY,
  });

  /*** -------> Coupon Mutation -------> */
  const couponMutation = useApiMutation({
    method: "update",
    path: (code) => `${API_PATHS.CLIENT_COUPON.CLIENT_COUPON_ENDPOINT}/${code}`,
    key: API_PATHS.CLIENT_COUPON.CLIENT_COUPON_KEY,
  });

  // Get the latest order (most recent)
  const latestCoupon = coupons?.length
    ? coupons.reduce((latest, current) =>
        new Date(current.createdAt) > new Date(latest.createdAt)
          ? current
          : latest
      )
    : null;

  /*** ------> Confirms coupon submission ------> */
  const applyCouponHandler = () => {
    if (!latestCoupon || !latestCoupon.code) return;

    setIsApplyingCoupon(true);

    const payload = {
      data: {
        code: latestCoupon.code,
        userId: user?._id,
        cartTotal: calculateTotal(cartItems),
      },
    };
    console.log("Payload", payload);

    couponMutation.mutate(payload, {
      onSuccess: (res) => {
        setDiscountAmount(res.discountAmount);
        setAppliedCoupon(latestCoupon?.code?.toUpperCase());
        toast.success(res.message);
        setIsApplyingCoupon(false);
      },
      onError: (err) => {
        toast.error(err?.response?.message || "Failed to apply coupon");
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setIsApplyingCoupon(false);
      },
    });
  };

  const calculateTotal = (items) =>
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  /*** ------> Confirms order submission ------> */
  const handleOrderConfirmation = (e) => {
    e?.preventDefault();
    if (!selectedAddress && !formData) {
      toast.error(
        "Please select a saved address or fill in the shipping form!"
      );
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add items first.");
      return;
    }

    const { _id, ...addressWithoutId } = selectedAddress;

    const payload = isNewAddressForm ? formData : addressWithoutId;

    orderMutation.mutate(
      {
        data: {
          items: cartItems,
          totalAmount: calculateTotal(cartItems) - discountAmount,
          discountAmount,
          couponCode: appliedCoupon, // ✅ send correct key
          shippingAddress: payload,
          paymentMethod,
        },
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            toast.success(res.message);
            navigate("/client-order-confirmation", {
              state: {
                order: {
                  items: cartItems,
                  totalAmount: calculateTotal(cartItems),
                  orderId: res?.data?.orderId,
                },
              },
            });
            setCartItems([]);
          } else toast.error("Unexpected response from server.");
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error creating order"),
      }
    );
  };

  /** -------> Fetched Data Handlers -------> */
  const cartsDataStatus = useFetchedDataStatusHandler({
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
    label: "cartsData",
  });

  const savedOrdersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders",
  });

  const addressDataStatus = useFetchedDataStatusHandler({
    isLoading: isAddressLoading,
    isError: isAddressError,
    error: addressError,
    label: "addressData",
  });

  const couponDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingCoupon,
    isError: isErrorCoupon,
    error: errorCoupon,
    label: "Coupon",
  });

  return (
    <>
      <DynamicPageTitle pageTitle={pageTitle} />

      {cartsDataStatus.status !== "success" ? (
        cartsDataStatus.content
      ) : (
        <div className="grid lg:grid-cols-12 grid-cols-1 gap-6">
          {/* Left Panel: Cart & Shipping */}
          <div className="lg:col-span-9 col-span-12 space-y-6">
            <CheckOutItemList
              items={cartItems}
              cartsDataStatus={cartsDataStatus}
            />

            <div className="bg-base-200 lg:p-6 p-2 rounded-xl shadow">
              <h2 className="text-2xl font-bold flex items-center space-x-2 lg:mb-4 mb-2">
                <FaAddressCard size={24} />
                <span>Shipping Address</span>
              </h2>

              {isNewAddressForm ? (
                <form
                  onSubmit={handleOrderConfirmation}
                  className="grid grid-cols-1 gap-3"
                >
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    handleInputChange
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="email"
                    placeholder="Email address..."
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="addressLine1"
                    placeholder="Address Line 1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="addressLine2"
                    placeholder="Address Line 2"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                    />
                    <label htmlFor="isDefault">Set as Default</label>
                  </div>
                  {addresses.length > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline mt-2 ml-"
                      onClick={() => setIsNewAddressForm(false)}
                    >
                      <ArrowLeftCircleIcon /> Back to Saved Addresses
                    </button>
                  )}
                </form>
              ) : addressDataStatus.status !== "success" ? (
                addressDataStatus.content
              ) : (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className="flex items-center space-x-4 border border-base-content/15 p-2 rounded cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="shippingAddress"
                        checked={selectedAddress._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                      />
                      <div>
                        <p className="font-semibold">{addr.fullName}</p>
                        <p>
                          {addr.addressLine1} {addr.addressLine2}
                        </p>
                        <p>
                          {addr.city}, {addr.state}, {addr.postalCode},{" "}
                          {addr.country}
                        </p>
                        {addr.isDefault && (
                          <span className="text-green-600 font-bold text-xs">
                            Default
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                  <button
                    type="button"
                    className="btn btn-outline mt-2"
                    onClick={() => setIsNewAddressForm(true)}
                  >
                    <FaAddressCard size={20} /> Add a New Address
                  </button>
                </div>
              )}

              <h2 className="text-2xl font-bold mt-6 flex items-center space-x-2">
                <CreditCardIcon />
                <span>Payment Method</span>
              </h2>
              <div className="lg:flex grid gap-2 space-x-2 mt-2">
                {["COD", "Card", "Bkash", "Nagad"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={`btn ${
                      paymentMethod === method ? "btn-primary" : "btn-outline"
                    }`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/*------> Right Panel: Checkout Summary------> */}
          <div className="lg:col-span-3 col-span-12">
            <CheckOutSummaryPanel
              items={cartItems}
              handleOrderConfirmation={handleOrderConfirmation}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              applyCouponHandler={applyCouponHandler}
              isApplyingCoupon={isApplyingCoupon}
              appliedCoupon={appliedCoupon}
              discountAmount={discountAmount}
              orders={savedOrdersData}
              coupons={coupons}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOutPage;
