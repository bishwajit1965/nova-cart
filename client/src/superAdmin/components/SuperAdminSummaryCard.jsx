import { Box, DollarSign, Package, Users } from "lucide-react";

const SuperAdminSummaryCard = ({ users }) => {
  /*** ------> Now accessed fields directly ------>  */
  const totalUsers = users?.totalUsers;
  const totalOrders = users?.totalOrders;
  const totalSales = users?.totalSales;
  const activeProducts = users?.activeProducts;

  const cards = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: <Users className="h-6 w-6" />,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <Package className="h-6 w-6" />,
    },
    {
      label: "Total Sales",
      value: `$${totalSales ? totalSales.toLocaleString() : 0}`,
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      label: "Active Products",
      value: activeProducts,
      icon: <Box className="h-6 w-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="p-4 bg-base-100 shadow rounded-2xl flex items-center gap-4"
        >
          <div className="p-2 bg-base-content/15 text-base-content/70 rounded-lg">
            {c.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p>
              <span className="lg:text-2xl font-extrabold">{c.value}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuperAdminSummaryCard;
