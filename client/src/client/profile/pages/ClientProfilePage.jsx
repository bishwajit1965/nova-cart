// client/pages/ProfilePage.jsx

import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../../common/components/ui/Button";
import DynamicPageTitle from "../../../common/utils/pageTitle/DynamicPageTitle";
import { Input } from "../../../common/components/ui/Input";
import { LucideIcon } from "../../../common/lib/LucideIcons";
import PageMeta from "../../../common/components/ui/PageMeta";
import { SlashSquare } from "lucide-react";
import toast from "react-hot-toast";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../../common/utils/hooks/useFetchedDataStatusHandler";
import usePageTitle from "../../../superAdmin/services/hooks/usePageTitle";

const ClientProfilePage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const pageTitle = usePageTitle();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);

  /***------> Fetch user info QUERY ------> */
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PROFILE_ME.CLIENT_PROFILE_ME_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PROFILE_ME.CLIENT_PROFILE_KEY,
    options: { staleTime: 0 },
  });

  /***------> Fetch orders info QUERY ------> */
  const {
    data: orders,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT,
    queryKey: API_PATHS.CLIENT_ORDERS.CLIENT_KEY,
    options: { staleTime: 0 },
  });

  /***------> Set user data when fetched ------> */
  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  /***------> Profile Update user info mutation ------> */
  const profileUpdateMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.CLIENT_PROFILE_ME.CLIENT_PROFILE_ME_ENDPOINT}/${payload.userId}`,
    key: API_PATHS.CLIENT_PROFILE_ME.CLIENT_PROFILE_KEY,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    },
  });

  const handleSave = (userId) => {
    const payload = { data: userData };
    console.log("Payload", payload);
    profileUpdateMutation.mutate({ userId, ...payload });
  };

  /*** -----> Cancel order MUTATION -----> */
  const updateOrderMutation = useApiMutation({
    method: "update",
    path: (payload) =>
      `${API_PATHS.CLIENT_ORDERS.CLIENT_ORDERS_ENDPOINT}/${payload.orderId}`,
    key: API_PATHS.CLIENT_ORDERS.CLIENT_KEY, // used by useQuery
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      console.error(error);
    },
  });

  /*** -----> Cancel order handler -----> */
  const handleCancelOrder = (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    // const payload = { data: status };
    updateOrderMutation.mutate({ orderId });
  };

  /*** -----> FETCHED USERS & ORDERS DATA HANDLERS HOOKS -----> */
  const userDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: errorUser,
    label: "user",
  });

  const ordersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders",
  });

  return (
    <>
      <PageMeta
        title="My Profile Page || Nova-Cart"
        description="You can know about yourself from here in details."
      />
      <DynamicPageTitle pageTitle={pageTitle} />
      <div className="max-w-7xl mx-auto bg-base-200 rounded-xl shadow">
        {/*** ---------> USER INFO SECTION ---------> */}
        {userDataStatus.status !== "success" ? (
          userDataStatus.content
        ) : (
          <div className="max-w-3xl mx-auto lg:p-6 p- space-y-6">
            {/* Personal Info */}
            <div className="bg-base-100 rounded-xl shadow p-6 space-y-4">
              <h2 className="text-2xl font-bold">Personal Info</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className={`input w-full ${
                    isEditing ? "input-bordered" : "input-disabled"
                  }`}
                  disabled={!isEditing}
                />
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className={`input w-full ${
                    isEditing ? "input-bordered" : "input-disabled"
                  }`}
                  disabled={!isEditing}
                />
                <Input
                  type="text"
                  value={userData.phone || ""}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className={`input w-full ${
                    isEditing ? "input-bordered" : "input-disabled"
                  }`}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex space-x-2 mt-4">
                {isEditing ? (
                  <>
                    <Button
                      variant="indigo"
                      icon={LucideIcon.Save}
                      onClick={() => handleSave(userData._id)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="warning"
                      icon={LucideIcon.X}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    icon={LucideIcon.Edit}
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/*** --------> ORDERS INFO SECTION --------> */}
            <div className="bg-base-100 rounded-xl shadow lg:p-6 space-y-4">
              <h2 className="text-2xl font-bold">My Orders</h2>
              {ordersDataStatus.status !== "success" ? (
                ordersDataStatus.content
              ) : orders?.length ? (
                <div className="space-y-4">
                  {orders?.map((order) => (
                    <div
                      key={order._id}
                      className="border border-base-content/25 rounded-lg p-4 bg-base-200 flex flex-col space-y-2"
                    >
                      <p>
                        <span className="font-bold">Order ID:</span>{" "}
                        {order.orderId}
                      </p>
                      <p>
                        <span className="font-bold">Status:</span>{" "}
                        {order.status}
                      </p>
                      <p>
                        <span className="font-bold">Total:</span> $
                        {order.totalAmount.toFixed(2)}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {order?.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-2 border border-base-content/25 p-2 rounded"
                          >
                            {item?.image ? (
                              <img
                                src={item?.image ? item.image : item.images[0]}
                                alt={item?.name}
                                className="h-36 object-contain w-full"
                              />
                            ) : (
                              item.images && (
                                <img
                                  src={`${apiURL}${
                                    item.images[0].startsWith("/") ? "" : "/"
                                  }${item.images[0]}`}
                                  alt={item.name || ""}
                                  className="h-36 object-contain w-full"
                                />
                              )
                            )}
                            {/* <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12"
                            /> */}
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm">
                                ${item.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.status === "pending" && (
                        <Button
                          variant="warning"
                          className="mt-2 flex items-center space-x-2"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          <SlashSquare /> <span>Cancel Order</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No orders found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientProfilePage;
