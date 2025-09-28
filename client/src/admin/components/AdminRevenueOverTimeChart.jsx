import {
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

const AdminRevenueOverTimeChart = () => {
  /*** ------> Admin Analytics fetcher QUERY ------> */
  const {
    data: revenueOverTime = [],
    isLoading: isLoadingRevenueOverTime,
    isError: isErrorRevenueOverTime,
    error: errorRevenueOverTime,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_PRODUCT_REPORT.REVENUE_OVER_TIME_ENDPOINT}`,
    queryKey: API_PATHS.ADMIN_PRODUCT_REPORT.REVENUE_OVER_TIME_KEY,
  });
  console.log("Revenue over time===>", revenueOverTime);

  /*** ----> Data fetch status handler hooks ----> */
  const revenueOverTimeDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingRevenueOverTime,
    isError: isErrorRevenueOverTime,
    error: errorRevenueOverTime,
    label: "recent-orders",
  });
  return (
    <div className="lg:col-span-6 col-span-12">
      {revenueOverTimeDataStatus.status !== "success" ? (
        revenueOverTimeDataStatus.content
      ) : (
        <Card className="p-4">
          <h2 className="text-xl font-bold border-b border-base-content/15 pb-2 mb-3 text-stone-400">
            📈 Revenue Over Time
          </h2>

          <ResponsiveContainer width="100%" height={255}>
            <LineChart data={revenueOverTime || []}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="totalRevenue"
                stroke="#4F46E5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};

export default AdminRevenueOverTimeChart;
