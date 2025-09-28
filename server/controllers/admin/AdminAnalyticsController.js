import User from "../../models/User.js";

export const getAdminUsersAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Example: count users created in the last 7 days
    const last7Days = Array.from({ length: 7 })
      .map((_, idx) => {
        const day = new Date();
        day.setDate(day.getDate() - idx);

        const start = new Date(day.setHours(0, 0, 0, 0));
        const end = new Date(day.setHours(23, 59, 59, 999));

        return {
          date: start.toISOString().split("T")[0],
        };
      })
      .reverse();

    const usersOverTime = await Promise.all(
      last7Days.map(async (d) => {
        const count = await User.countDocuments({
          createdAt: {
            $gte: new Date(d.date),
            $lt: new Date(
              new Date(d.date).setDate(new Date(d.date).getDate() + 1)
            ),
          },
        });
        return { date: d.date, count };
      })
    );

    res.status(200).json({
      success: true,
      message: "Admin users analytics fetched successfully!",
      data: {
        totalUsers,
        usersOverTime,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin users analytics",
      error: error.message,
    });
  }
};

export default { getAdminUsersAnalytics };
