import Feature from "../../models/Feature.js";
import Plan from "../../models/Plan.js";
import { serializePlan } from "../../utils/serializePlan.js";

export const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features, description } = req.body;

    // Validate referenced features
    const validFeatures = await Feature.find({ _id: { $in: features } });
    if (validFeatures?.length !== features?.length) {
      return res.status(400).json({ message: "Invalid feature IDs detected" });
    }
    const planDocs = { name, price, duration, features, description };
    const plan = await Plan.create(planDocs);

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan.map(serializePlan),
    });
  } catch (error) {
    console.error("Error in creating plan!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("features")
      .sort({ createdAt: -1 });
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

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, duration, features, description } = req.body;
    const updateDocs = { name, price, duration, features, description };

    const updatedPlan = await Plan.findByIdAndUpdate(id, updateDocs, {
      new: true,
    }).populate("features");

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.status(200).json({
      message: "Plan updated successfully!",
      plan: updatedPlan,
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

export const deletePlan = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedPlan = await Plan.findByIdAndDelete(id);
    if (!deletePlan)
      return res
        .status(404)
        .json({ success: false, message: "Plan not found!" });
    res.status(201).json({
      success: true,
      message: "Plan deleted successfully!",
      data: deletedPlan,
    });
  } catch (error) {
    console.error("Error in deleting plan!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export default { createPlan, getAllPlans, updatePlan, deletePlan };
