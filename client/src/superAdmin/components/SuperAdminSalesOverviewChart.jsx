import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const SuperAdminSalesOverviewChart = ({ days = 30, salesData }) => {
  return (
    <div className="p-4 bg-base-100">
      <h2 className="text-lg font-bold mb-4">
        Sales & Orders Overview (Last {days} days)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />

          {/* Total Sales Line */}
          <Line
            type="monotone"
            dataKey="totalSales"
            stroke="#4f46e5"
            strokeWidth={2}
            name="Total Sales"
          />

          {/* Total Orders Line */}
          <Line
            type="monotone"
            dataKey="totalOrders"
            stroke="#22c55e"
            strokeWidth={2}
            name="Total Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SuperAdminSalesOverviewChart;
