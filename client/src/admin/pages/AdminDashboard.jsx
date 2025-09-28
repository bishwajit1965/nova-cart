import AdminRecentOrdersCard from "../components/AdminRecentOrdersCard";
import AdminRevenueOverTimeChart from "../components/AdminRevenueOverTimeChart";
import AdminTopProductsCard from "../components/AdminTopProductsCard";
import AdminUsersAnalyticsCard from "../components/AdminUsersAnalyticsCard";
import OrderStatusCard from "../components/OrderStatusCard";
import OrdersOverTimeCard from "../components/OrdersOverTimeCard";
import OrdersRevenueSummaryCard from "../components/OrdersRevenueSummaryCard";
import UsersStatusCard from "../components/UsersStatusCard";

const AdminDashboard = () => {
  return (
    <div className="lg:space-y-6 space-y-4">
      <div className="">
        <h1 className="lg:text-2xl text-xl font-bold text-stone-400">
          Admin Analytics Dashboard{" "}
        </h1>
      </div>
      <div className="lg:space-y-6 space-y-4">
        <div className="grid lg:grid-cols-12 grid-cols-1 justify-between md:grid-cols-3 lg:gap-6 gap-4 lg:space-y-4 space-y-2">
          {/* Users status card */}
          <UsersStatusCard />

          {/* Orders status card */}
          <OrderStatusCard />

          {/* Orders Revenue status summary card */}
          <OrdersRevenueSummaryCard />

          {/* Orders over time last 30days chart*/}
          <OrdersOverTimeCard />

          {/* Users Growth Chart */}
          <AdminUsersAnalyticsCard />

          {/* Top products card */}
          <AdminTopProductsCard />

          {/* Revenue over time chart */}
          <AdminRevenueOverTimeChart />
        </div>
        {/* Recent orders card */}
        <AdminRecentOrdersCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
