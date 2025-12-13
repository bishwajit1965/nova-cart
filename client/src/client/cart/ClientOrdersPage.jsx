import {
  Eye,
  LucideClipboardList,
  Package,
  ShoppingCart,
  SlashSquareIcon,
  XCircle,
} from "lucide-react";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../common/components/ui/Button";
import DynamicPageTitle from "../../common/utils/pageTitle/DynamicPageTitle";
import { Link } from "react-router-dom";
import NoDataFound from "../../common/components/ui/NoDataFound";
import PageMeta from "../../common/components/ui/PageMeta";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../superAdmin/services/hooks/usePageTitle";

const ClientOrdersPage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const pageTitle = usePageTitle();

  /** ------> Fetch Orders QUERY ------> */
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT,
    queryKey: API_PATHS.CLIENT_ORDERS.CLIENT_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  /** -----> Use Fetched Data Status Handler -----> */
  const ordersStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders",
  });

  /*** -----> Cancel order MUTATION -----> */
  const cartMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT}/${payload.orderId}`,
    key: API_PATHS.CLIENT_ORDERS.CLIENT_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error cancelling order");
      console.error(error);
    },
  });

  /*** -----> Cancel order handler -----> */
  const handleCancelOrder = (orderId, status) => {
    const payload = { orderId: orderId, data: { status: status } };
    cartMutation.mutate(payload, {
      onSuccess: (res) => {
        console.log("Response", res.data.items);
      },
      onError: (err) => {
        console.error("Failed to cancel order:", err);
        toast.error("Failed to cancel order");
      },
    });
  };

  /*** -----> Active and cancelled orders filtered -----> */
  const activeOrders =
    orders?.filter((order) => order.status !== "cancelled") || [];
  const cancelledOrders =
    orders?.filter((order) => order.status === "cancelled") || [];

  const renderOrderCard = (order) => (
    <div
      key={order._id}
      className={`border border-base-content/15 lg:p-4 p-2 rounded-lg shadow-sm ${
        order.status === "cancelled"
          ? "bg-base-content/5 border border-yellow-500/50"
          : ""
      }`}
    >
      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between">
        <div className="lg:col-span-6">
          {order?.items?.map((item) => (
            <div
              key={item._id}
              className="grid lg:grid-cols-12 grid-cols-1 items-centers justify-between lg:gap-4 gap-2 lg:space-y-3 space-y-2"
            >
              {item.product ? (
                <>
                  <div className="lg:col-span-4 col-span-12">
                    {item.product?.image ? (
                      <img
                        src={
                          item?.product?.image
                            ? item.product.image
                            : item.product.images[0]
                        }
                        alt={item.product?.name}
                        className="w-1/3 object-cover border p-1 rounded-md shadow border-base-content/15"
                      />
                    ) : (
                      item?.product.images[0] && (
                        <img
                          src={`${apiURL}${
                            item.product.images[0].startsWith("/") ? "" : "/"
                          }${item.product.images[0]}`}
                          alt={item.product.name || ""}
                          className="w-1/3 object-cover border p-1 rounded-md shadow border-base-content/15"
                        />
                      )
                    )}
                  </div>
                  <div className="lg:col-span-8 col-span-12">
                    <p className="flex items-center justify-end space-x-2">
                      {item?.product?.name} {" - "}
                      {item?.product?.price} x {item.quantity} =
                      <span className="font-semibold ml-2 flex justify-end">
                        ${(item?.product?.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-red-600">Product unavailable</p>
              )}
            </div>
          ))}
        </div>

        <div className="lg:col-span-6 bg-base-200 rounded-md lg:p-3 space-y-2">
          <p className="text-green-600 font-bold">Order ID: {order.orderId}</p>
          <p>
            Status:{" "}
            <span
              className={`${
                order.status === "delivered"
                  ? "text-green-600 bg-sky-100 px-2 py-1 rounded-md border border-base-content/15"
                  : order.status === "pending"
                  ? "text-yellow-600 bg-indigo-100 px-2 py-1 rounded-md border border-base-content/15"
                  : order.status === "cancelled"
                  ? "text-white bg-red-500 px-2 py-1 rounded-md border-yellow border-base-content/15 animate-pulse"
                  : order.status === "processing"
                  ? "text-green-600 bg-blue-100 px-2 py-1 rounded-md border border-base-content/15"
                  : order.status === "shipped"
                  ? "text-red-600 bg-purple-100 px-2 py-1 rounded-md border border-base-content/15"
                  : "text-blue-600 bg-sky-300 px-2 py-1 rounded-md border border-base-content/15"
              } font-medium`}
            >
              {order.status}
            </span>
          </p>
          <p>
            Total:{" "}
            <span className="font-semibold">
              ${order?.totalAmount.toFixed(2)}
            </span>
          </p>
          <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
          <p>Items: {order?.items?.length}</p>

          <div className="mt-4 lg:flex space-x-2 lg:space-y-0 space-y-2">
            <Link to={`/client-order-details/${order.orderId}`}>
              <Button variant="default" size="sm" className="lg:btn-md btn-sm ">
                <Eye size={16} /> Details
              </Button>
            </Link>

            {order.status !== "cancelled" &&
              order.status !== "processing" &&
              order.status !== "shipped" &&
              order.status !== "delivered" && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    className="lg:btn-md btn-sm "
                    onClick={() => handleCancelOrder(order.orderId)}
                  >
                    <SlashSquareIcon size={16} /> Cancel Order
                  </Button>
                </>
              )}

            <Link to="/client-cart-management">
              <Button variant="indigo" size="sm" className="lg:btn-md btn-sm ">
                <ShoppingCart size={16} /> Shop
              </Button>
            </Link>

            {order.status === "cancelled" && (
              <div className="cursor-not-allowed">
                <Button
                  variant="warning"
                  size="sm"
                  className="lg:btn-md btn-sm "
                  disabled
                >
                  <XCircle size={16} /> Cancelled
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ------> Page meta ------> */}
      <PageMeta
        title="Client Orders Page || Nova-cart"
        description="You can view and check your placed orders here."
      />
      <DynamicPageTitle pageTitle={pageTitle} />

      {/*** -----> Orders section -----> */}
      {ordersStatus.status !== "success" ? (
        ordersStatus.content
      ) : (
        <div className="max-w-5xl mx-auto lg:p-4">
          {orders?.length > 0 && (
            <h2 className="lg:text-2xl text-xl font-bold mb-6 flex items-center space-x-2">
              <Package size={25} /> <span>My Orders </span>
              <span>{orders.length > 0 ? orders.length : 0}</span>
            </h2>
          )}
          {orders?.length === 0 ? (
            <NoDataFound />
          ) : (
            <div className="max-w-5xl mx-auto lg:p-4 lg:space-y-6 space-y-4">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <LucideClipboardList />{" "}
                <span>{activeOrders ? activeOrders.length : ""}</span>
                <span>Active Orders</span>
              </h2>
              {activeOrders.length === 0 ? (
                <p>No active orders.</p>
              ) : (
                activeOrders.map((order) => renderOrderCard(order))
              )}

              <h2 className="text-2xl font-bold flex items-center space-x-2 mt-6 text-red-500">
                <LucideClipboardList /> <span>Cancelled Orders</span>
                <span>{cancelledOrders.length}</span>
              </h2>
              {cancelledOrders.length === 0 ? (
                <p>No cancelled orders.</p>
              ) : (
                cancelledOrders.map((order) => renderOrderCard(order, true))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ClientOrdersPage;
