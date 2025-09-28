import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import dayjs from "dayjs";

export const getAdminSummary = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalSalesAgg, activeProducts] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: null,
              totalSales: {
                $sum: { $ifNull: ["$totalAmount", "$grandTotal"] },
              },
            },
          },
        ]),
        Product.countDocuments({ status: "active" }),
      ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;
    res.status(200).json({
      success: true,
      message: "Data fetched successfully!",
      data: { totalUsers, totalOrders, totalSales, activeProducts },
    });
  } catch (error) {
    console.error("Error in fetching data", error);
    res.status(500).json({
      message: "Failed to fetch admin summary",
      message: error.message,
    });
  }
};

export const getSalesOverview = async (req, res) => {
  try {
    // Optional: allow query param for last N days
    const days = parseInt(req.query.days) || 30;
    const startDate = dayjs()
      .subtract(days - 1, "day")
      .startOf("day")
      .toDate();
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }, // e.g. last 30 days
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: { $ifNull: ["$totalAmount", 0] } },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Data fetched successfully!",
      data: salesData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsersGrowthOverview = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const usersData = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalUsers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      message: "Users growth fetched successfully",
      data: usersData,
    });
  } catch (error) {
    console.error("Error in fetching data", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};

export default { getAdminSummary, getSalesOverview, getUsersGrowthOverview };
