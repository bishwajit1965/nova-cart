import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const SuperAdminUsersGrowthChart = ({ days = 30, usersGrowth }) => {
  return (
    <div className="p-4 bg-base-100">
      <h2 className="text-lg font-bold mb-4">
        User Sign-ups (Last {days} days)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={usersGrowth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalUsers"
            stroke="#f43f5e"
            strokeWidth={2}
            name="New Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SuperAdminUsersGrowthChart;
