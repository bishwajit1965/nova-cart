import PlanHistory from "../../models/PlanHistory.js";

export const getAllPlanHistories = async (req, res) => {
  try {
    const histories = await PlanHistory.find({})
      .populate("userId", "name email")
      .populate("planId", "name price duration")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Plan histories fetched successfully!",
      data: histories,
    });
  } catch (error) {
    console.error("Error in fetching plan histories", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { getAllPlanHistories };
