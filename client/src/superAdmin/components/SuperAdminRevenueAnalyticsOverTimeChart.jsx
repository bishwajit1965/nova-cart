import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/Card";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

import API_PATHS from "../services/apiPaths/apiPaths";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const SuperAdminRevenueAnalyticsOverTimeChart = () => {
  const [chartData, setChartData] = useState([]);

  const {
    data: weeklyBilling,
    isLoading: isLoadingRevenueAnalytics,
    isError: isErrorRevenueAnalytics,
    error: errorRevenueAnalytics,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_WEEKLY_BILLING.SUP_ADMIN_BILLING_ENDPOINT}/weekly-revenue`,
    queryKey: API_PATHS.SUP_ADMIN_WEEKLY_BILLING.SUP_ADMIN_BILLING_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (weeklyBilling?.revenueOverTime) {
      setChartData(weeklyBilling.revenueOverTime);
    }
  }, [weeklyBilling]);

  const weeklyRevenueDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingRevenueAnalytics,
    isError: isErrorRevenueAnalytics,
    error: errorRevenueAnalytics,
    label: "Revenue analytics",
  });

  return (
    <div>
      {weeklyRevenueDataStatus.status !== "success" ? (
        weeklyRevenueDataStatus.content
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="text-lg font-semibold mb-4">
              Total Revenue: ${weeklyBilling?.totalRevenue.toFixed(2)}
            </div>

            <ResponsiveContainer width="100%" height={310}>
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                    })
                  }
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  formatter={(value, name) =>
                    name === "totalRevenue"
                      ? [`$${value.toFixed(2)}`, "Revenue"]
                      : [value, "Transactions"]
                  }
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalTransactions"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  name="Transactions"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>

          <CardContent>
            <div className="text-lg font-semibold mb-4">
              Total Revenue: ${weeklyBilling?.totalRevenue.toFixed(2)}
            </div>

            {/* Weekly Revenue Table */}
            <div className="overflow-x-auto mt-6">
              <table className="table-auto table-sm w-full border border-base-content/20 rounded-lg">
                <thead>
                  <tr className="bg-base-200">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-right">Total Revenue ($)</th>
                    <th className="px-4 py-2 text-right">Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item) => (
                    <tr
                      key={item.date}
                      className="border-t border-base-content/10"
                    >
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2 text-right">
                        {item.totalRevenue.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {item.totalTransactions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuperAdminRevenueAnalyticsOverTimeChart;
