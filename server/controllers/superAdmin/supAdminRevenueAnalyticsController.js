import Plan from "../../models/Plan.js";
import PlanHistory from "../../models/PlanHistory.js";

export const getSuperAdminRevenueAnalytics = async (req, res) => {
  console.log("🎯 Controller is hit!");
  try {
    // Last 7 days range
    const last7Days = Array.from({ length: 7 })
      .map((_, idx) => {
        const day = new Date();
        day.setDate(day.getDate() - idx);
        const start = new Date(day.setHours(0, 0, 0, 0));
        const end = new Date(day.setHours(23, 59, 59, 999));

        return { date: start.toISOString().split("T")[0], start, end };
      })
      .reverse();

    // Fetch and calculate revenue per day
    const revenueOverTime = await Promise.all(
      last7Days.map(async (d) => {
        const histories = await PlanHistory.find({
          createdAt: { $gte: d.start, $lte: d.end },
        }).populate("planId", "price");

        const totalRevenue = histories.reduce(
          (sum, record) => sum + (record?.planId?.price || 0),
          0
        );

        return {
          date: d.date,
          totalRevenue,
          totalTransactions: histories.length,
        };
      })
    );

    // Calculate total revenue overall
    const totalRevenue = revenueOverTime.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );

    res.status(200).json({
      success: true,
      message: "Super admin revenue analytics fetched successfully!",
      data: {
        totalRevenue,
        revenueOverTime,
      },
    });
  } catch (error) {
    console.error("Error in super admin revenue analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch super admin revenue analytics",
      error: error.message,
    });
  }
};

export default { getSuperAdminRevenueAnalytics };
