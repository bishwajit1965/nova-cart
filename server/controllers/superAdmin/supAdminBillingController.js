// server/controllers/superAdmin/supAdminBillingController.js

// controllers/superAdmin/billingController.js
export const getBillingSummary = async (req, res) => {
  try {
    // Mock data — later this can be dynamic using real plan & user models
    const summary = {
      totalUsers: 120,
      plans: [
        { name: "Basic", users: 85, revenue: 0 },
        { name: "Pro", users: 25, revenue: 249.75 },
        { name: "Enterprise", users: 10, revenue: 499.9 },
      ],
      totalRevenue: 749.65,
    };

    res.status(200).json({
      success: true,
      message: "Billing summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching billing summary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { getBillingSummary };
