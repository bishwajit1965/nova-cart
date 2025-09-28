import API_PATHS from "../../superAdmin/services/apiPaths/apiPaths";
import Badge from "../../common/components/ui/Badge";
import Loader from "../../common/components/ui/Loader";
import toast from "react-hot-toast";
import { useApiMutation } from "../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const STATUSES = ["active", "inactive", "banned", "deleted", "pending"];

const AdminUserManagementPage = () => {
  const [loading, setLoading] = useState(false);

  /*** ------> Users fetcher QUERY ------> */
  const {
    data: usersResponse,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    url: API_PATHS.ADMIN_USERS.ADMIN_USERS_ENDPOINT,
    queryKey: API_PATHS.ADMIN_USERS.ADMIN_USERS_KEY,
  });
  const users = Array.isArray(usersResponse?.data)
    ? usersResponse.data
    : Array.isArray(usersResponse)
    ? usersResponse
    : [];

  /** ------> Update Users Status MUTATION ------> */
  const userUpdateMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.ADMIN_USERS.ADMIN_USERS_ENDPOINT}/${payload.userId}`,
    key: API_PATHS.ADMIN_USERS.ADMIN_USERS_KEY, // used by useQuery
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
    label: "users",
  });

  return (
    <>
      {loading && <Loader />}
      {usersDataStatus.status !== "success" ? (
        usersDataStatus.content
      ) : (
        <div className="space-y-4">
          <div className="">
            <h2 className="lg:text-2xl text-xl font-bold">Users List</h2>
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
                {users?.map((user) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserManagementPage;
