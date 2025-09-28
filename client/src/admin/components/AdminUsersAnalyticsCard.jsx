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
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const AdminUsersAnalyticsCard = () => {
  const [userAnalytics, setUserAnalytics] = useState({
    totalUsers: 0,
    usersOverTime: 0,
  });
  /*** ------> Admin Analytics fetcher QUERY ------> */
  const {
    data: userDataAnalytics = [],
    isLoading: isLoadingAnalytics,
    isError: isErrorAnalytics,
    error: errorAnalytics,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_ANALYTICS.USERS_ANALYTICS_ENDPOINT}`,
    queryKey: API_PATHS.ADMIN_ANALYTICS.USERS_ANALYTICS_KEY,
  });

  useEffect(() => {
    if (userDataAnalytics) {
      setUserAnalytics(userDataAnalytics);
    }
  }, [userDataAnalytics]);

  console.log("User analytics data", userDataAnalytics);

  /*** ----> Data fetch status handler hooks ----> */
  const userAnalyticsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingAnalytics,
    isError: isErrorAnalytics,
    error: errorAnalytics,
    label: "user-analytics",
  });
  return (
    <div className="lg:col-span-6 col-span-12">
      {userAnalyticsDataStatus.status !== "success" ? (
        userAnalyticsDataStatus.content
      ) : (
        <div className="lg:col-span-6 col-span-12">
          <Card className="lg:p-4 p-2 min-h-[20rem] border border-base-content/15 w-full text-stone-400">
            <h2 className="text-xl font-bold border-b border-base-content/15 pb-2 mb-4 text-stone-400">
              👥 Users Analytics
            </h2>
            <p className="text-sm">Total Users: {userAnalytics?.totalUsers}</p>
            <ResponsiveContainer width="100%" height={225}>
              <LineChart data={userAnalytics?.usersOverTime}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsersAnalyticsCard;
