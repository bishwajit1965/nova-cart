import Feature from "../../models/Feature.js";

export const createFeature = async (req, res) => {
  try {
    const { title, key, description } = req.body;

    const existing = await Feature.findOne({ key });
    if (existing)
      return res.status(400).json({ message: "Feature already exists!" });
    const featureDocs = { title, key, description };
    const feature = await Feature.create(featureDocs);

    res.status(201).json({
      success: true,
      message: "Feature created successfully!",
      data: feature,
    });
  } catch (error) {
    console.error("Error in creating feature!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.find().sort({ createdAt: -1 });
    if (!features)
      return res
        .status(404)
        .json({ success: false, message: "Features not found" });
    res.status(200).json({
      success: true,
      message: "Features fetched successfully!",
      data: features,
    });
  } catch (error) {
    console.error("Error in fetching features!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, key, description } = req.body;

    // Basic validation
    if (!title || !key) {
      return res.status(400).json({ message: "Title and key are required" });
    }

    // Check if key is unique (ignore current document)
    const existing = await Feature.findOne({ key, _id: { $ne: id } });
    if (existing) {
      return res.status(400).json({ message: "Feature key already exists!" });
    }

    const updatedFeatureDocs = {
      title: title.trim(),
      key: key.trim(),
      description: description?.trim(),
    };

    // Update feature
    const updatedFeature = await Feature.findByIdAndUpdate(
      id,
      updatedFeatureDocs,
      { new: true } // returns updated document
    );

    if (!updatedFeature) {
      return res.status(404).json({ message: "Feature not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Feature updated successfully!",
      data: updatedFeature,
    });
  } catch (error) {
    console.error("Error in updating feature!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const deleteFeature = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedFeature = await Feature.findByIdAndDelete(id);
    if (!deletedFeature)
      return res
        .status(404)
        .json({ success: false, message: "Feature not found" });
    res
      .status(200)
      .json({ success: true, message: "Feature deleted successfully!" });
  } catch (error) {
    console.error("Error in deleting feature", error);
    res.status(500).json({
      success: false,
      message: "internal server error!",
      error: error.message,
    });
  }
};

export default { createFeature, getAllFeatures, updateFeature, deleteFeature };
