import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Card from "../../common/components/ui/Card";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import { useEffect } from "react";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const UsersStatusCard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  /*** ------> Users fetcher QUERY ------> */
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    url: `${API_PATHS.ADMIN_USERS.STATUS_SUMMARY}`,
    queryKey: API_PATHS.ADMIN_USERS.STATUS_SUMMARY_KEY,
  });

  useEffect(() => {
    setStats(users);
  }, [users]);

  /*** ----> Data fetch status handler hooks ----> */
  const usersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    label: "users",
  });
  return (
    <>
      {usersDataStatus.status !== "success" ? (
        usersDataStatus.content
      ) : (
        <div className="lg:col-span-4 col-span-12 rounded-2xl text-stone-500">
          <Card className="space-y-2 border border-base-content/15 min-h-[17rem]">
            <h2 className="lg:test-2xl text-xl font-bold border-b border-base-content/15 pb-2">
              Users Status:
            </h2>

            <p className="font-bold">
              Total Users:{" "}
              <strong className="text-xl font-extrabold">
                {stats.totalUsers}
              </strong>
            </p>
            <p className="font-bold">
              Active Users:{" "}
              <strong className="text-green-600 text-xl font-extrabold">
                {stats.activeUsers}
              </strong>
            </p>
            <p className="font-bold">
              Inactive Users:{" "}
              <strong className="text-red-600 text-xl font-extrabold">
                {stats.inactiveUsers}
              </strong>
            </p>
          </Card>
        </div>
      )}
    </>
  );
};

export default UsersStatusCard;
