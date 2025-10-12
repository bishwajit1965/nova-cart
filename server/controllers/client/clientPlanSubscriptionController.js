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

    // Compute endedAt based on plan duration
    let endedAt = null;
    const now = new Date();

    if (plan.duration === "monthly") {
      endedAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    } else if (plan.duration === "yearly") {
      endedAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    } else if (plan.duration === "lifetime") {
      endedAt = null;
    }

    // Save plan history snapshot
    await PlanHistory.create({
      userId: user._id,
      planId: plan._id,
      action,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.map((f) => f.key),
      isActive: true,
      startedAt: new Date(),
      endedAt,
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

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    if (!plans)
      return res
        .status(400)
        .json({ success: false, message: "Plans not found!" });
    res.status(200).json({
      success: true,
      message: "Plans fetched successfully!",
      data: plans,
    });
  } catch (error) {
    console.error("Error in fetching plans!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const upgradePlan = async (req, res) => {
  console.log("🎯Plan upgrade method is hit!");
  try {
    const { userId, newPlanId } = req.body;
    const user = await User.findById(userId).populate("plan");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan)
      return res
        .status(404)
        .json({ success: false, message: "new plan not found!" });
    // Prevent downgrading accidentally
    if (newPlan.price <= user.plan.price) {
      return res.status(400).json({ message: "This is not an upgrade " });
    }
    // Deactivate old plan history entry
    const newHistory = await PlanHistory.create({
      user: user._id,
      plan: newPlan._id,
      priceAtPurchase: newPlan.price,
      duration: newPlan.duration,
      isActive: true,
      startedAt: new Date(),
      expiresAt:
        newPlan.duration === "lifetime"
          ? null
          : new Date(
              new Date().setFullYear(
                new Date().getFullYear() +
                  (newPlan.duration === "yearly" ? 1 : 0)
              ) +
                (newPlan.duration === "monthly" ? 30 * 24 * 60 * 60 * 1000 : 0)
            ),
    });
    // update user's current plan
    user.plan = newPlan._id;
    await user.save();

    res.status(200).json({
      message: "Plan upgraded successfully!",
      planHistory: newHistory,
      plan: newPlan,
    });
  } catch (error) {
    console.error("Error in updating plan!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const downgradePlan = async (req, res) => {
  console.log("✅Plan downgrade method is hit!");
  try {
    const { userId, newPlanId } = req.body;
    const user = await User.findById(userId).populate("plan");
    const newPlan = await Plan.findById(newPlanId);

    if (!user || !newPlan)
      return res.status(404).json({ message: "User or plan not found" });

    if (newPlan.price >= user.plan.price) {
      return res.status(400).json({ message: "This is not a downgrade." });
    }

    await PlanHistory.updateMany({ user: user._id }, { isActive: false });

    const newHistory = await PlanHistory.create({
      user: user._id,
      plan: newPlan._id,
      priceAtPurchase: newPlan.price,
      duration: newPlan.duration,
      isActive: true,
      startedAt: new Date(),
      expiresAt:
        newPlan.duration === "lifetime"
          ? null
          : new Date(
              new Date().setFullYear(
                new Date().getFullYear() +
                  (newPlan.duration === "yearly" ? 1 : 0)
              ) +
                (newPlan.duration === "monthly" ? 30 * 24 * 60 * 60 * 1000 : 0)
            ),
    });

    user.plan = newPlan._id;
    await user.save();

    res.status(200).json({
      message: "Plan downgraded successfully!",
      planHistory: newHistory,
      plan: newPlan,
    });
  } catch (error) {
    console.error("Downgrade error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ❌ Cancel Plan (revert to Basic)
export const cancelPlan = async (req, res) => {
  console.log("🔵Plan cancel method is hit!");
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("plan");

    const basicPlan = await Plan.findOne({ price: 0 });
    if (!basicPlan)
      return res
        .status(404)
        .json({ message: "Basic plan not found. Please seed it first." });

    await PlanHistory.updateMany({ user: user._id }, { isActive: false });

    const cancelHistory = await PlanHistory.create({
      user: user._id,
      plan: basicPlan._id,
      priceAtPurchase: 0,
      duration: basicPlan.duration,
      isActive: true,
      startedAt: new Date(),
      expiresAt: null,
    });

    user.plan = basicPlan._id;
    await user.save();

    res.status(200).json({
      message: "Plan canceled successfully. Reverted to Basic.",
      planHistory: cancelHistory,
      plan: basicPlan,
    });
  } catch (error) {
    console.error("Cancel error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default {
  subscribePlan,
  getUserPlan,
  getAllPlans,
  upgradePlan,
  downgradePlan,
  cancelPlan,
};
