// client/pages/ProfilePage.jsx

import { Recycle, RefreshCcw, SlashSquare } from "lucide-react";
import { containerVariants, itemVariants } from "../../service/animations";
import { useEffect, useState } from "react";

import API_PATHS from "../../../superAdmin/services/apiPaths/apiPaths";
import Button from "../../../common/components/ui/Button";
import DynamicPageTitle from "../../../common/utils/pageTitle/DynamicPageTitle";
import { Input } from "../../../common/components/ui/Input";
import { LucideIcon } from "../../../common/lib/LucideIcons";
import PageMeta from "../../../common/components/ui/PageMeta";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useApiMutation } from "../../../superAdmin/services/hooks/useApiMutation";
import { useApiQuery } from "../../../superAdmin/services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../../common/utils/hooks/useFetchedDataStatusHandler";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../../superAdmin/services/hooks/usePageTitle";

const ClientProfilePage = () => {
  const apiURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const pageTitle = usePageTitle();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const navigate = useNavigate();

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

  /***------> Fetch Plan History Info QUERY ------> */
  const {
    data: planHistory,
    isLoading: isLoadingUserPlanHistory,
    isError: isErrorUserPlanHistory,
    error: errorUserPlanHistory,
  } = useApiQuery({
    url: API_PATHS.CLIENT_PAN_HISTORY.CLIENT_PLAN_HISTORY_ENDPOINT,
    queryKey: API_PATHS.CLIENT_PAN_HISTORY.CLIENT_HISTORY_KEY,
    options: { staleTime: 0 },
  });

  console.log("Orders", orders);
  console.log("Plan History", planHistory);

  const filteredHistory = planHistory
    ?.filter((h) =>
      h.planId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    ?.filter((h) =>
      filterAction ? h.action.toLowerCase() === filterAction : true
    );
  console.log("Filter history", filteredHistory);
  const resetFilterHistory = () => {
    setSearchTerm("");
    setFilterAction("");
  };

  const displayHistory =
    searchTerm || filterAction ? filteredHistory : planHistory;

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

  const planHistoryDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUserPlanHistory,
    isError: isErrorUserPlanHistory,
    error: errorUserPlanHistory,
    label: "Plan history",
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

            {/* Plan History section begins */}

            {planHistoryDataStatus.status !== "success" ? (
              planHistoryDataStatus.content
            ) : (
              <motion.div
                className="rounded-xl mt-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                variants={containerVariants}
              >
                <motion.div
                  className="lg:mb-6 mb-4 lg:px-12 px-2 py-4 bg-base-100 rounded-xl shadow"
                  variants={containerVariants}
                >
                  <motion.h2
                    className="lg:text-2xl text-xl font-extrabold"
                    variants={itemVariants}
                  >
                    💳 My Plan History
                  </motion.h2>

                  {/* Active Plans section begins */}
                  <motion.div
                    className="grid lg:grid-cols-12 grid-cols-1 lg:gap-8 gap-4 justify-between lg:my-10 my-4 "
                    variants={containerVariants}
                  >
                    <div className="lg:col-span-6 col-span-12">
                      {/* Active Plan Section */}
                      {planHistory?.length > 0 && (
                        <motion.div
                          className="rounded-xl mb-8"
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false }}
                          variants={containerVariants}
                        >
                          <motion.div
                            className="lg:mb-6 mb-4 lg:px-12 px-2 py-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow"
                            variants={containerVariants}
                          >
                            <motion.h2
                              className="lg:text-2xl text-xl font-extrabold text-indigo-700 dark:text-indigo-300"
                              variants={itemVariants}
                            >
                              🌟 Active Plan
                            </motion.h2>
                          </motion.div>

                          {(() => {
                            const activePlan = planHistory.find(
                              (h) => h.isActive
                            );
                            if (!activePlan)
                              return (
                                <div className="text-center text-gray-500 font-medium">
                                  No active plan found.
                                </div>
                              );

                            return (
                              <div className="p-6 bg-base-100 rounded-xl shadow hover:shadow-lg transition-all">
                                <h3 className="text-xl font-semibold text-gray-800">
                                  {activePlan.planId?.name}
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                  {activePlan.planId?.description ||
                                    "Active subscription"}
                                </p>
                                <div className="mt-3 flex justify-between text-sm text-gray-500">
                                  <span>💰 Price: ${activePlan.price}</span>
                                  <span>
                                    📅 Started:{" "}
                                    {new Date(
                                      activePlan.startedAt
                                    ).toLocaleDateString("en-US")}
                                  </span>
                                </div>
                                {activePlan.expiresAt && (
                                  <p className="text-sm text-gray-500 mt-1">
                                    ⏳ Expires:{" "}
                                    {new Date(
                                      activePlan.expiresAt
                                    ).toLocaleDateString("en-US")}
                                  </p>
                                )}
                              </div>
                            );
                          })()}
                        </motion.div>
                      )}
                    </div>
                    {/* Plan History Filter */}
                    <div className="lg:col-span-6 col-span-12">
                      <div className="flex flex-wrap gap-3 mb-6 items-center">
                        <input
                          type="text"
                          placeholder="Search plan..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="input input-bordered w-full sm:w-40"
                        />
                        <select
                          value={filterAction}
                          onChange={(e) => setFilterAction(e.target.value)}
                          className="select select-bordered w-full sm:w-32"
                        >
                          <option value="">Select Actions</option>
                          <option value="">All Actions</option>
                          <option value="upgrade">Upgrade</option>
                          <option value="downgrade">Downgrade</option>
                          <option value="cancel">Cancel</option>
                        </select>
                        <Button
                          type="submit"
                          variant="warning"
                          onClick={resetFilterHistory}
                          className="btn btn-md w-16"
                        >
                          <RefreshCcw />
                        </Button>
                      </div>
                      <div className="">
                        {displayHistory && displayHistory.length > 0 ? (
                          displayHistory.map((fh) => (
                            <div key={fh._id} className="">
                              <p>
                                {fh.planId.name} ➡️ ${" "}
                                {fh.planId.price.toFixed(2)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-gray-500 font-medium">
                            No matching history found.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Plan summary status section */}
                  <div className="">
                    <div className="lg:col-span-4 col-span-12">
                      {planHistory?.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                          {[
                            {
                              label: "Upgrades",
                              color: "bg-green-100 text-green-700",
                              key: "upgrade",
                            },
                            {
                              label: "Downgrades",
                              color: "bg-yellow-100 text-yellow-700",
                              key: "downgrade",
                            },
                            {
                              label: "Cancellations",
                              color: "bg-red-100 text-red-700",
                              key: "cancel",
                            },
                          ].map((stat) => (
                            <div
                              key={stat.key}
                              className={`p-4 rounded-xl text-center shadow-sm ${stat.color}`}
                            >
                              <p className="text-lg font-semibold">
                                {
                                  planHistory.filter(
                                    (h) => h.action.toLowerCase() === stat.key
                                  ).length
                                }
                              </p>
                              <p className="text-sm font-medium">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="lg:space-y-4 space-y-2 rounded-2xl"
                  variants={containerVariants}
                >
                  {!planHistory || planHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 text-center p-6">
                      <div className="mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-14 h-14 text-indigo-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Subscription Yet
                      </h3>
                      <p className="text-gray-500 max-w-md">
                        You haven’t subscribed to any plan yet. Once you do,
                        your subscription history will appear here — calm,
                        clear, and under control.
                      </p>
                      <button
                        onClick={() => navigate("/client-plan-subscription")}
                        className="mt-6 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm cursor-pointer mb-4"
                      >
                        Explore Plans
                      </button>
                    </div>
                  ) : (
                    planHistory &&
                    planHistory.length > 0 && (
                      <div className="space-y-4 mt-6">
                        {planHistory.map((history) => (
                          <div
                            key={history._id}
                            className="relative p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 transition-all hover:shadow-md"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                {history.planId?.name || "Unknown Plan"}
                              </h3>
                              <span
                                className={`text-sm font-medium px-3 py-1 rounded-full ${
                                  history.action === "upgrade"
                                    ? "bg-green-100 text-green-700"
                                    : history.action === "downgrade"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : history.action === "cancel"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {history.action.charAt(0).toUpperCase() +
                                  history.action.slice(1)}
                              </span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              <span className="font-medium">Features:</span>{" "}
                              {history.features?.join(", ") || "—"}
                            </p>

                            <div className="mt-3 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                              <span>
                                <span className="font-medium">Price:</span> $
                                {history.price}
                              </span>
                              <span>
                                Started:{" "}
                                {new Date(history.startedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ClientProfilePage;
