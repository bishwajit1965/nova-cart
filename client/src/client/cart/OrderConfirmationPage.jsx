import { LucideCreditCard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import ClientStripePaymentForm from "../checkout/ClientStripePaymentForm";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { LucideIcon } from "../../common/lib/LucideIcons";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useAuth } from "../../common/hooks/useAuth";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";
import NoDataFound from "../../common/components/ui/NoDataFound";

const OrderConfirmationPage = () => {
  const { user } = useAuth();
  const userId = user?._id;
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

  /** -------> Fetched Data Handlers -------> */
  const savedOrdersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders",
  });

  const latestOrder = savedOrdersData?.[0];

  const location = useLocation();
  const order = location?.state?.order;
  const pageTitle = usePageTitle();
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:300";
  if (!order?.items || order?.items?.length === 0) {
    return <NoDataFound label="Orders" />;
  }

  const { items, totalAmount, orderId } = order;

  return (
    <>
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="lg:max-w-7xl w-full mx-auto lg:space-y-10 space-y-4">
        <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-8 gap-4">
          <div className="lg:col-span-8 col-span-12 border border-base-content/15 shadow rounded-lg hover:shadow-md">
            <div className="space-y-3">
              <div className="bg-base-200 border-b border-base-content/15 shadow lg:p-3 p-2 rounded-t-lg lg:col-span-3 col-span-12">
                <div className="">
                  <h2 className="lg:text-3xl text-lg font-bold text-center text-green-600">
                    🎉 Your order has been placed!
                  </h2>
                </div>
              </div>

              <div className="lg:space-y-3 space-y-2 text-center">
                <LucideIcon.CircleCheckBig
                  className=" text-green-500 lg:text-left mx-auto"
                  size={30}
                />

                <p className="text-xl font-bold">
                  🛒 Order ID:{" "}
                  <span className="font-semibold">{orderId || "N/A"}</span>
                </p>
                <p className="text-center text-xs text-gray-500">
                  A confirmation email has been sent to your registered address.
                </p>
              </div>
            </div>
          </div>

          {/* Stripe payment */}
          {savedOrdersDataStatus.status !== "success" ? (
            savedOrdersDataStatus.content
          ) : (
            <div className="lg:col-span-4 col-span-12 border border-base-content/15 shadow rounded-lg hover:shadow-md">
              <div className="shadow hover:shadow-lg rounded-lg space-y-4">
                <div className="bg-base-200 border-b border-base-content/15 shadow lg:p-3 p-2 rounded-t-lg">
                  <h2 className="lg:text-3xl text-lg font-bold text-center text-green-600 flex items-center space-x-2">
                    <LucideCreditCard /> <span>Payment with Stripe</span>
                  </h2>
                </div>
                <div className="">
                  <ClientStripePaymentForm
                    orderId={latestOrder._id}
                    amount={latestOrder.totalAmount}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {items?.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between border-b border-base-content/15 w-full"
            >
              <div className="lg:w-1/4 w-1/4 h-auto pb-2">
                {item?.product?.images && (
                  <img
                    src={`${apiURL}${item?.product?.images[0]}`}
                    alt={item?.product?.name}
                    className="lg:w-2/5 w-16 h-16 object-contain"
                  />
                )}
              </div>
              <div className="w-1/4 h-12">
                {item?.product?.name} x {item?.product?.price} x{" "}
                {item?.quantity}
              </div>
              <div className="w-1/4 text-right font-bold">
                ${(item?.product?.price * item?.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        <div className="lg:space-y-10 space-y-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <div className="text-center lg:pt-12 pt-4 border-t border-base-content/15">
            <div className="lg:flex justify-center grid lg:space-x-4 space-x-2 lg:space-y-0 space-y-2">
              <Link to="/client-cart-management">
                <Button variant="global" className="lg:w-52 w-52">
                  <LucideIcon.ShoppingCart size={25} /> Continue Shopping
                </Button>
              </Link>
              <Link to="/client-specific-orders">
                <Button variant="global" className="lg:w-52 w-52">
                  <LucideIcon.List size={25} /> My Order Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;
