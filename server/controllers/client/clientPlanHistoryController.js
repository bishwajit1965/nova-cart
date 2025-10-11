// server/controllers/client/planHistoryController.js

import Plan from "../../models/Plan.js";
import PlanHistory from "../../models/PlanHistory.js";
import User from "../../models/User.js";

export const subscribePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId)
      return res
        .status(400)
        .json({ success: false, message: "Plan Id is required" });

    const plan = await Plan.findById(planId).populate("features");
    if (!plan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found!" });

    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    // Detect upgrade or downgrade
    let action = "subscribe";
    if (user.plan) {
      const currentPlan = await Plan.findById(user.plan);
      action = plan.price > currentPlan.price ? "upgrade" : "downgrade";
    }

    // Save plan to user
    user.plan = plan._id;
    await user.save();

    // Save plan history snapshot
    await PlanHistory.create({
      userId: user._id,
      planId: plan._id,
      action,
      price: plan.price,
      features: plan.features.map((f) => f.key),
    });

    res.status(200).json({
      success: true,
      message: "Plan history saved successfully!",
      data: { plan, userId: user._id },
    });
  } catch (error) {
    console.error("Error in saving plan history~", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllPlanHistory = async (req, res) => {
  try {
    const planHistory = await PlanHistory.find({ userId: req.user._id })
      .populate("userId", "name email")
      .populate("planId", "name price features");
    if (!planHistory || planHistory.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No plan history records found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Plan history fetched successfully!",
      data: planHistory,
    });
  } catch (error) {
    console.error("Error in fetching plan history!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default { subscribePlan, getAllPlanHistory };
