import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const OrderStatusCard = () => {
  const [orderStatus, setOrderStatus] = useState({
    cancelledOrders: 0,
    completedOrders: 0,
    ordersToday: 0,
    pendingOrders: 0,
    processingOrders: 0,
    totalOrders: 0,
  });

  /*** ------> Orders fetcher QUERY ------> */
  const {
    data: stats = [],
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_ORDERS.STATUS_SUMMARY}`,
    queryKey: API_PATHS.ADMIN_ORDERS.STATUS_SUMMARY_KEY,
  });

  useEffect(() => {
    if (stats) {
      setOrderStatus(stats);
    }
  }, [stats]);

  console.log("Order status===>", stats);

  /*** ----> Data fetch status handler hooks ----> */
  const ordersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingStats,
    isError: isErrorStats,
    error: errorStats,
    label: "stats",
  });
  return (
    <>
      {ordersDataStatus.status !== "success" ? (
        ordersDataStatus.content
      ) : (
        <div className="lg:col-span-4 col-span-12 text-stone-500">
          <Card className="space-y-2 border border-base-content/15 min-h-[17rem] text-stone-500">
            <h2 className="lg:test-2xl text-xl font-bold border-b border-base-content/15 pb-2">
              Orders Status:
            </h2>
            <p className="font-bold">
              Cancelled orders: {orderStatus?.cancelledOrders}
            </p>
            <p className="font-bold">
              Completed orders: {orderStatus?.completedOrders}
            </p>
            <p className="font-bold">
              Pending orders: {orderStatus?.pendingOrders}
            </p>
            <p className="font-bold">
              Processing orders: {orderStatus?.processingOrders}
            </p>
            <p className="font-bold text-blue-500">
              Total orders: {orderStatus?.totalOrders}
            </p>
            <p className="font-bold text-shadow-emerald-500">
              Today's orders: {orderStatus?.ordersToday}
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default OrderStatusCard;
