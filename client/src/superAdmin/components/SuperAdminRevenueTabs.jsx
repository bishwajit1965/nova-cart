import SuperAdminMonthlyRevenueChart from "./SuperAdminMonthlyRevenueChart";
import SuperAdminRevenueAnalyticsOverTimeChart from "./SuperAdminRevenueAnalyticsOverTimeChart";
import { useState } from "react";

const SuperAdminRevenueTabs = () => {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <div className="mt-6">
      <div className="lg:my-4 my-4 lg:p-4 p-4 border-b border-base-content/15 bg-base-300 rounded-t-xl">
        <h2 className="lg:text-2xl font-bold text-base-content/80">
          Monthly & Weekly Revenue Analytics Combined
        </h2>
      </div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b border-base-content/20">
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "weekly"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 font-semibold ${
            activeTab === "monthly"
              ? "border-b-2 border-indigo-500 text-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly
        </button>
      </div>

      {/* Chart Content */}
      <div>
        {activeTab === "weekly" && <SuperAdminRevenueAnalyticsOverTimeChart />}
        {activeTab === "monthly" && <SuperAdminMonthlyRevenueChart />}
      </div>
    </div>
  );
};

export default SuperAdminRevenueTabs;
