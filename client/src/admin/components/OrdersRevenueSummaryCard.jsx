import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const OrdersRevenueSummaryCard = () => {
  const [revenueStatus, setRevenueStatus] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });

  /*** ---> Orders revenue fetcher QUERY ---> */
  const {
    data: revenue,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    error: errorRevenue,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_ORDERS.REVENUE_SUMMARY}`,
    queryKey: API_PATHS.ADMIN_ORDERS.REVENUE_SUMMARY_KEY,
  });

  useEffect(() => {
    if (revenue) {
      setRevenueStatus(revenue);
    }
  }, [revenue]);

  console.log("Revenue summary===>", revenue);
  /*** ---> Data fetch status handler hooks ---> */
  const revenueDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
    error: errorRevenue,
    label: "revenue",
  });

  return (
    <>
      {revenueDataStatus.status !== "success" ? (
        revenueDataStatus.content
      ) : (
        <div className="lg:col-span-4 col-span-12 text-stone-500">
          <Card className="space-y-2 border border-base-content/15 text-stone-500 min-h-[17rem]">
            <h2 className="lg:test-2xl text-xl font-bold border-b border-base-content/15 pb-2">
              Revenue Status:
            </h2>
            <p>Total orders: {revenueStatus?.totalOrders || 0}</p>
            <p>
              Total revenue: $
              {revenueStatus?.totalRevenue
                ? revenueStatus?.totalRevenue.toFixed(2)
                : "0.00"}
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default OrdersRevenueSummaryCard;
