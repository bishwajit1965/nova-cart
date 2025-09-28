import API_PATHS from "../services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import DownLoadPanel from "../../common/components/ui/DownLoadPanel";
import SuperAdminSalesOverviewChart from "../components/SuperAdminSalesOverviewChart";
import SuperAdminSummaryCard from "../components/SuperAdminSummaryCard";
import SuperAdminUsersGrowthChart from "../components/SuperAdminUsersGrowthChart";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";

const SuperAdminDashboard = () => {
  /*** ------> Users fetcher QUERY ------> */
  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    url: API_PATHS.DB_SUMMARY.SUPERADMIN_SUMMARY_ENDPOINT,
    queryKey: API_PATHS.DB_SUMMARY.SUPERADMIN_SUMMARY_KEY,
  });

  /*** ------> Orders fetcher QUERY ------> */
  const {
    data: salesData,
    isLoading: isLoadingSalesData,
    isError: isErrorSalesData,
    error: errorSalesData,
  } = useApiQuery({
    url: API_PATHS.DB_ANALYTICS.ORDERS_ANALYTICS_ENDPOINT,
    queryKey: API_PATHS.DB_ANALYTICS.ORDERS_ANALYTICS_KEY,
  });

  /*** ------> Users growth fetcher QUERY ------> */
  const {
    data: usersGrowth,
    isLoading: isLoadingUsersGrowth,
    isError: isErrorUsersGrowth,
    error: errorUsersGrowth,
  } = useApiQuery({
    url: API_PATHS.DB_ANALYTICS.USERS_ANALYTICS_ENDPOINT,
    queryKey: API_PATHS.DB_ANALYTICS.USERS_ANALYTICS_KEY,
  });

  /*** ------> Data fetch status handler hooks ------> */
  const usersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    label: "users",
  });

  const salesDataDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingSalesData,
    isError: isErrorSalesData,
    error: errorSalesData,
    label: "orders",
  });

  const usersGrowthDataDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUsersGrowth,
    isError: isErrorUsersGrowth,
    error: errorUsersGrowth,
    label: "users-growth",
  });

  return (
    <div className="lg:space-y-6 space-y-4">
      <div className="lg:mb-4 mb-2">
        <h1 className="lg:text-2xl text-xl font-bold">
          Super Admin Analytics Dashboard
        </h1>
      </div>

      <div className="">
        {usersDataStatus.status !== "success" ? (
          usersDataStatus.content
        ) : (
          <SuperAdminSummaryCard users={users} />
        )}
      </div>

      <div className="grid lg:grid-cols-12 grid-cols-1 lg:gap-6 gap-4 justify-between">
        <div className="lg:col-span-6 col-span-12">
          {salesDataDataStatus.status !== "success" ? (
            salesDataDataStatus.content
          ) : (
            <div className="">
              <Card>
                <SuperAdminSalesOverviewChart salesData={salesData} />
                <DownLoadPanel
                  data={salesData}
                  filename="sales-overview"
                  fields={["_id", "totalSales", "totalOrders"]}
                  label="Sales Overview"
                />
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 col-span-12">
          {usersGrowthDataDataStatus.status !== "success" ? (
            usersGrowthDataDataStatus.content
          ) : (
            <div className="">
              <Card>
                <SuperAdminUsersGrowthChart usersGrowth={usersGrowth} />
                <DownLoadPanel
                  data={usersGrowth}
                  filename="users-growth"
                  fields={["_id", "totalUsers"]}
                  label="Users Growth"
                />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
