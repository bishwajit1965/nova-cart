import PlanHistory from "../../models/PlanHistory.js";

export const getSuperAdminMonthlyRevenue = async (req, res) => {
  try {
    const last30Days = Array.from({ length: 30 })
      .map((_, idx) => {
        const day = new Date();
        day.setDate(day.getDate() - idx);
        const start = new Date(day.setHours(0, 0, 0, 0));
        const end = new Date(day.setHours(23, 59, 59, 999));
        return { date: start.toISOString().split("T")[0], start, end };
      })
      .reverse();

    const revenueOverTime = await Promise.all(
      last30Days.map(async (d) => {
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

    const totalRevenue = revenueOverTime.reduce(
      (sum, item) => sum + item.totalRevenue,
      0
    );

    res.status(200).json({
      success: true,
      message: "Monthly revenue analytics fetched successfully!",
      data: { totalRevenue, revenueOverTime },
    });
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly revenue",
      error: error.message,
    });
  }
};

export default { getSuperAdminMonthlyRevenue };
