// client/pages/ProfilePage.jsx

import { containerVariants, itemVariants } from "../../service/animations";
import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../../common/components/ui/Button";
import DynamicPageTitle from "../../../common/utils/pageTitle/DynamicPageTitle";
import { Input } from "../../../common/components/ui/Input";
import { LucideIcon } from "../../../common/lib/LucideIcons";
import PageMeta from "../../../common/components/ui/PageMeta";
import { SlashSquare } from "lucide-react";
import { motion } from "framer-motion";
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

  console.log("Orders", orders);

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
          <div className="lg:max-w-4xl mx-auto lg:py-16 py-4 lg:space-y-6 space-y-4">
            {/* Personal Info */}
            <motion.div
              className="bg-base-100 rounded-xl shadow lg:p-12 p-2 space-y-4 hover:shadow-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={containerVariants}
            >
              <motion.h2
                className="text-2xl font-extrabold"
                variants={itemVariants}
              >
                👤 Personal Info
              </motion.h2>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={itemVariants}
              >
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
                  placeholder="Phone..."
                />
              </motion.div>
              <motion.div
                className="flex space-x-2 mt-4"
                variants={itemVariants}
              >
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
              </motion.div>
            </motion.div>

            {/*** --------> ORDERS INFO SECTION --------> */}
            <motion.div
              className="rounded-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={containerVariants}
            >
              <motion.div
                className="lg:mb-6 mb-4 lg:px-12 px-2 py-4  bg-base-100 rounded-xl shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                variants={containerVariants}
              >
                <motion.h2
                  className="lg:text-2xl text-xl font-extrabold"
                  variants={itemVariants}
                >
                  🛒 My Orders
                </motion.h2>
              </motion.div>
              {ordersDataStatus.status !== "success" ? (
                ordersDataStatus.content
              ) : orders?.length ? (
                <motion.div
                  className="lg:space-y-8 space-y-4 rounded-2xl"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  variants={containerVariants}
                >
                  {orders?.map((order) => (
                    <motion.div
                      key={order._id}
                      className="lg:p-12 p-2 flex flex-col space-y-2 bg-base-100 shadow rounded-xl hover:shadow-2xl"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false }}
                      variants={containerVariants}
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

                      <motion.div
                        className="grid lg:grid-cols-12 grid-cols-1 lg:gap-4 gap-2 justify-between mt-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false }}
                        variants={containerVariants}
                      >
                        {order?.items.map((item) => (
                          <div
                            key={item._id}
                            className="lg:col-span-3 col-span-12 border border-base-content/15 rounded-md shadow hover:shadow-lg"
                          >
                            {item?.product?.images && (
                              <div className="flex justify-center">
                                <img
                                  src={`${apiURL}${item?.product?.images[0]}`}
                                  alt={item.name || ""}
                                  className="h-20 w-full object-contain"
                                />
                              </div>
                            )}
                            <div className="p-2">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm">
                                ${item.price.toFixed(2)} x {item.quantity}
                                <span className="font-bold">
                                  {" "}
                                  = ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </motion.div>

                      {order.status === "pending" && (
                        <Button
                          variant="warning"
                          className="mt-2 flex items-center space-x-2"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          <SlashSquare /> <span>Cancel Order</span>
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <p className="font-bold text-center">No orders found.</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientProfilePage;
