// server/controller/client/clientSubscriptionController.js

import Plan from "../../models/Plan.js";
import User from "../../models/User.js";

export const subscribePlan = async (req, res) => {
  try {
    console.log("🎯 Subscription method hit");
    console.log("REQ BODY:", req.body);

    const { planId } = req.body;

    // 1️⃣ Validate planId
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "Plan ID is required!",
      });
    }

    // 2️⃣ Check plan existence
    const plan = await Plan.findById(planId).populate("features");
    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found!",
      });
    }

    // 3️⃣ Find and update user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // 4️⃣ Update and save plan reference
    user.plan = plan._id;
    await user.save(); // 👈 await is critical!

    // 5️⃣ Send confirmation
    return res.status(200).json({
      success: true,
      message: "Plan subscribed successfully!",
      data: {
        plan,
        userId: user._id,
      },
    });
  } catch (error) {
    console.error("💥 Error in plan subscription:", error);
    return res.status(500).json({
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

export const updateUserPlan = async (req, res) => {
  try {
    const { planId } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    user.plan = planId; // <-- just change the plan ID
    await user.save();

    res.status(200).json({
      success: true,
      message: "User plan updated successfully!",
      data: { planId: user.plan },
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
export default { subscribePlan, getUserPlan, updateUserPlan };
