// server/controller/client/clientSubscriptionController.js

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

    //Detect Upgrade / downgrade
    let action = "subscribe";
    if (user.plan) {
      const currentPlan = await Plan.findById(user.plan);
      action = plan.price > currentPlan.price ? "upgrade" : "downgrade";
    }
    //Save plan to user
    user.plan = plan._id;
    await user.save();

    await PlanHistory.updateMany(
      { userId: user._id, isActive: true },
      { $set: { isActive: false, endedAt: new Date() } }
    );

    // Save plan history snapshot
    await PlanHistory.create({
      userId: user._id,
      planId: plan._id,
      action,
      price: plan.price,
      features: plan.features.map((f) => f.key),
      isActive: true,
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

export const getUserPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "plan",
        populate: { path: "features" },
      })
      .select("name email plan");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!user.plan) {
      return res.status(200).json({
        success: true,
        message: "User has no active plan.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User plan fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error("💥 Error fetching user plan:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export default { subscribePlan, getUserPlan };
