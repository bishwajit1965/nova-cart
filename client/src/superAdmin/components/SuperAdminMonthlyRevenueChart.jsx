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

const SuperAdminMonthlyRevenueChart = () => {
  const [chartData, setChartData] = useState([]);

  const {
    data: monthlyRevenue,
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
    error: errorMonthly,
  } = useApiQuery({
    url: `${API_PATHS.SUP_ADMIN_MONTHLY_BILLING.SUP_ADMIN_BILLING_ENDPOINT}/monthly-revenue`,
    queryKey: API_PATHS.SUP_ADMIN_MONTHLY_BILLING.SUP_ADMIN_BILLING_KEY,
    options: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  });

  useEffect(() => {
    if (monthlyRevenue?.revenueOverTime) {
      setChartData(monthlyRevenue.revenueOverTime);
    }
  }, [monthlyRevenue]);

  const monthlyRevenueDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingMonthly,
    isError: isErrorMonthly,
    error: errorMonthly,
    label: "Monthly Revenue",
  });

  return (
    <div>
      {monthlyRevenueDataStatus.status !== "success" ? (
        monthlyRevenueDataStatus.content
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold mb-4">
                Total Revenue: ${monthlyRevenue?.totalRevenue.toFixed(2)}
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  {/* <Tooltip /> */}
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2 rounded shadow">
                            <p className="font-semibold">{data.date}</p>
                            <p>Revenue: ${data.totalRevenue.toFixed(2)}</p>
                            <p>Transactions: {data.totalTransactions}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Table */}
              <div className="overflow-x-auto mt-6">
                <table className="table-auto w-full border-collapse border border-base-content/20">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Revenue ($)</th>
                      <th className="border px-4 py-2">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((d) => (
                      <tr key={d.date} className="hover:bg-base-100">
                        <td className="border px-4 py-2">{d.date}</td>
                        <td className="border px-4 py-2">
                          {d.totalRevenue.toFixed(2)}
                        </td>
                        <td className="border px-4 py-2">
                          {d.totalTransactions}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SuperAdminMonthlyRevenueChart;
