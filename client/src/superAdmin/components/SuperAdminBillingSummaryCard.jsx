import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../common/components/ui/Card";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DollarSign, Users } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const SuperAdminBillingSummaryCard = () => {
  const { data, isLoadingBillingData, isErrorBillingData, errorBillingData } =
    useApiQuery({
      url: API_PATHS.SUP_ADMIN_BILLING.SUP_ADMIN_BILLING_ENDPOINT,
      queryKey: API_PATHS.SUP_ADMIN_BILLING.SUP_ADMIN_BILLING_KEY,
    });

  /*** -----> FETCHED BILLING DATA HANDLERS HOOKS -----> */
  const billingDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingBillingData,
    isError: isErrorBillingData,
    error: errorBillingData,
    label: "Plans",
  });

  const billingData = data || {};
  const totalRevenue = billingData.totalRevenue?.toFixed(2);
  const totalUsers = billingData.totalUsers || 0;

  return (
    <div className="">
      {billingDataStatus.status !== "success" ? (
        billingDataStatus.content
      ) : (
        <Card className="shadow-lg bg-base-100 border border-base-content/10 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-extrabold text-indigo-700">
              <DollarSign size={22} className="text-green-500" />
              Billing Summary
            </CardTitle>
            <p className="text-sm text-gray-500 italic">Updated just now ⚡</p>
          </CardHeader>

          <CardContent className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-4">
            {/* Left Side - Summary Numbers */}
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex items-center gap-3">
                <Users className="text-indigo-500" />
                <span className="text-lg font-semibold">
                  Total Users:{" "}
                  <span className="font-bold text-indigo-700">
                    {totalUsers}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-500" />
                <span className="text-lg font-semibold">
                  Total Revenue:{" "}
                  <span className="font-bold text-green-600">
                    ${totalRevenue}
                  </span>
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Across all subscription plans.
              </div>
            </div>

            {/* Right Side - Pie Chart */}
            <div className="h-61">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={billingData.plans}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name }) => name}
                  >
                    {billingData.plans?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuperAdminBillingSummaryCard;
