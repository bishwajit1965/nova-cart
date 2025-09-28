import API_PATHS from "../services/apiPaths/apiPaths";
import Badge from "../../common/components/ui/Badge";
import NoDataFound from "../../common/components/ui/NoDataFound";
import Pagination from "../../common/pagination/Pagination";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const STATUSES = ["active", "inactive", "banned", "deleted", "pending"];
const SuperAdminUsersManagementPage = () => {
  const [loading, setLoading] = useState(false);
  /*** ------> Users fetcher QUERY ------> */
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    url: API_PATHS.SUPER_ADMIN_USERS.SUPER_ADMIN_USERS_ENDPOINT,
    queryKey: API_PATHS.SUPER_ADMIN_USERS.SUPER_ADMIN_USERS_KEY,
  });

  const [paginatedData, setPaginatedData] = useState(usersResponse || []);
  // To display total permissions in pagination
  const dataLength = usersResponse?.length;

  /** ------> Update Users Status MUTATION ------> */
  const userUpdateMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.SUPER_ADMIN_USERS.SUPER_ADMIN_USERS_ENDPOINT}/${payload.userId}`,
    key: API_PATHS.SUPER_ADMIN_USERS.SUPER_ADMIN_USERS_KEY, // used by useQuery
    onSuccess: () => {},
    onError: (error) => {
      toast.error("Error updating order status");
      console.error(error);
    },
  });

  // Update user status
  const handleStatusChange = (userId, status) => {
    try {
      setLoading(true);
      const payload = { userId, data: { status } };
      userUpdateMutation.mutate(payload, {
        onSuccess: () => {},
        onError: () => {
          toast.error("Error in updating status!");
        },
      });
    } catch (error) {
      console.error("error in status change", error);
    } finally {
      setLoading(false);
    }
  };

  /*** ------> Data fetch status handler hooks ------> */
  const usersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    label: "users-data",
  });
  return (
    <>
      {usersDataStatus.status !== "success" ? (
        usersDataStatus.content
      ) : (
        <div className="lg:space-y-6 space-y-4">
          <div className="">
            <h1 className="lg:text-2xl text-xl font-bold">User Management</h1>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-xs">
              <thead className="bg-base-300">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roles</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <NoDataFound label="User" />
                    </td>
                  </tr>
                ) : (
                  paginatedData?.map((user) => (
                    <tr key={user._id}>
                      <td>{user?.name}</td>
                      <td>{user?.email}</td>
                      <td className="space-x-1">
                        {user?.roles?.map((role) => (
                          <Badge key={role._id} color="blue">
                            {role?.name}
                          </Badge>
                        ))}
                      </td>
                      <td className="">
                        <Badge
                          color={
                            user?.status === "active"
                              ? "green"
                              : user.status === "inactive"
                              ? "gray"
                              : "red"
                          }
                        >
                          {user?.status}
                        </Badge>
                      </td>
                      <td>
                        <select
                          value={user?.status}
                          onChange={(e) =>
                            handleStatusChange(user._id, e.target.value)
                          }
                          className="p-2 border rounded"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="divider"></div>
            {/* pagination begins*/}
            <Pagination
              items={usersResponse}
              dataLength={dataLength}
              onPaginatedDataChange={setPaginatedData}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminUsersManagementPage;
