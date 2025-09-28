import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const OrdersOverTimeCard = () => {
  /*** ---> Orders revenue fetcher QUERY ---> */
  const {
    data: formattedOrders,
    isLoading: isLoadingFormatted,
    isError: isErrorFormatted,
    error: errorFormatted,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_ORDERS.ORDERS_OVER_TIME}`,
    queryKey: API_PATHS.ADMIN_ORDERS.ORDERS_OVER_TIME_KEY,
  });

  console.log("Orders over time", formattedOrders);
  /*** ---> Data fetch status handler hooks ---> */
  const revenueDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingFormatted,
    isError: isErrorFormatted,
    error: errorFormatted,
    label: "orders-over-time",
  });
  return (
    <div className="lg:col-span-6 col-span-12 min-h-[20rem]">
      {revenueDataStatus.status !== "success" ? (
        revenueDataStatus.content
      ) : (
        <Card className="lg:p-4 p-2 min-h-[20rem] border border-base-content/15 w-full">
          <h2 className="text-xl font-bold border-b border-base-content/15 pb-2 mb-4 text-stone-400">
            🛒 Orders Over Time (Last 30 Days)
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={formattedOrders}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalOrders" stroke="#4f46e5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default OrdersOverTimeCard;
