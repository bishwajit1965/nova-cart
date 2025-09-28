import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

import API_PATHS from "../services/apiPaths/apiPaths";
import SummaryCard from "../components/SummaryCard";
import { useApiQuery } from "../services/hooks/useApiQuery";
import useFetchedDataStatusHandler from "../../common/utils/hooks/useFetchedDataStatusHandler";
import { useState } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DD0"];

const ReportsAnalyticsManagement = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  /** ------> Orders Summary QUERY ------> */
  const {
    data: ordersSummary,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useApiQuery({
    url: API_PATHS.REPORTS.ORDERS_SUMMARY,
    queryKey: API_PATHS.REPORTS.ORDERS_SUMMARY_KEY,
  });

  /** ------> Orders Summary QUERY ------> */
  const {
    data: ordersOverTime,
    isLoading: isLoadingOrdersOverTime,
    isError: isErrorOrdersOverTime,
    error: errorOrdersOverTime,
  } = useApiQuery({
    url: API_PATHS.REPORTS.ORDERS_OVER_TIME,
    queryKey: API_PATHS.REPORTS.ORDERS_OVER_TIME_KEY,
  });

  const ordersOverTimeData = ordersOverTime?.map((item) => ({
    date: item._id, // keep original date string
    orders: item.totalOrders,
    sales: item.totalSales,
  }));

  /** ------> Users Summary QUERY ------> */
  const {
    data: usersSummary,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    url: API_PATHS.REPORTS.USERS_SUMMARY,
    queryKey: API_PATHS.REPORTS.USERS_SUMMARY_KEY,
  });

  /** ------> Users Summary QUERY ------> */
  const {
    data: productsSummary,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useApiQuery({
    url: API_PATHS.REPORTS.PRODUCTS_SUMMARY,
    queryKey: API_PATHS.REPORTS.PRODUCTS_SUMMARY_KEY,
  });

  const ordersByStatusData = ordersSummary?.ordersByStatus
    ? Object.entries(ordersSummary.ordersByStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : [];

  const usersByRoleData = usersSummary?.usersByRole
    ? Object.entries(usersSummary.usersByRole).map(([role, count]) => ({
        name: role,
        value: count,
      }))
    : [];

  const productsByCategoryData = productsSummary?.productsByCategory
    ? Object.entries(productsSummary.productsByCategory).map(
        ([category, count]) => ({ name: category, value: count })
      )
    : [];

  /*** ------> Data fetch status handlers ------> */
  const ordersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
    label: "orders-summary-report",
  });

  const usersDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    label: "users-summary-report",
  });

  const productsDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
    label: "products-summary-report",
  });

  const ordersOverTimeDataStatus = useFetchedDataStatusHandler({
    isLoading: isLoadingOrdersOverTime,
    isError: isErrorOrdersOverTime,
    error: errorOrdersOverTime,
    label: "orders-over-time",
  });

  const handleDateChange = () => {
    refetchOrders(); // trigger API call when date changes
  };

  return (
    <div className="lg:space-y-6 space-y-4">
      <div className="mb-4 lg:flex max-w-md flex-wrap lg:gap-4 gap-4 lg:my-4 my-2">
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            onBlur={handleDateChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            onBlur={handleDateChange}
          />
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid lg:grid-cols-12 grid-col-1 justify-between lg:gap-4 gap-2">
        <div className="lg:col-span-3 col-span-12">
          {ordersDataStatus.status !== "success" ? (
            ordersDataStatus.content
          ) : (
            <SummaryCard
              title="Total Orders"
              value={ordersSummary?.totalOrders || 0}
              icon={ShoppingCart}
            />
          )}
        </div>
        <div className="lg:col-span-3 col-span-12">
          {ordersDataStatus.status !== "success" ? (
            ordersDataStatus.content
          ) : (
            <SummaryCard
              title="Total Sales"
              value={`$${ordersSummary?.totalSales?.toFixed(2) || 0}`}
              icon={DollarSign}
            />
          )}
        </div>
        <div className="lg:col-span-3 col-span-12">
          {usersDataStatus.status !== "success" ? (
            usersDataStatus.content
          ) : (
            <SummaryCard
              title="Total Users"
              value={usersSummary?.totalUsers || 0}
              icon={Users}
            />
          )}
        </div>
        <div className="lg:col-span-3 col-span-12">
          {productsDataStatus.status !== "success" ? (
            productsDataStatus.content
          ) : (
            <SummaryCard
              title="Total Products"
              value={productsSummary?.totalProducts || 0}
              icon={Package}
            />
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-2">
        <div className="lg:col-span-6 colspan-12 bg-base-100 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {ordersByStatusData.map((entry, index) => (
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

        <div className="lg:col-span-6 colspan-12 bg-base-100 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Users by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usersByRoleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {usersByRoleData.map((entry, index) => (
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
      </div>
      <div className="grid lg:grid-cols-12 grid-cols-1 justify-between lg:gap-6 gap-2">
        <div className="lg:col-span-6 col-span-12 bg-base-100 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Products by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productsByCategoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-6 col-span-12 bg-base-100 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Low Stock Products</h3>
          <ul className="divide-y divide-base-content/20 max-h-72 overflow-y-auto">
            {productsSummary?.lowStockProducts?.map((p) => (
              <li key={p._id} className="py-2 flex justify-between">
                <span>{p.name}</span>
                <span>{p.stock}</span>
              </li>
            ))}
            {productsSummary?.lowStockProducts?.length === 0 && (
              <li>No low-stock products</li>
            )}
          </ul>
        </div>
      </div>

      {/* Orders over time line chart */}
      {ordersOverTimeDataStatus.status !== "success" ? (
        ordersOverTimeDataStatus.content
      ) : (
        <div className="bg-base-100 p-4 rounded-xl shadow">
          <h3 className="font-bold mb-2">Orders Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersOverTimeData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
              <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ReportsAnalyticsManagement;
