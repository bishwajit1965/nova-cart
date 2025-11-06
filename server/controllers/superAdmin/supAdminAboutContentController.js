import AboutContent from "../../models/AboutContent.js";
import fs from "fs";
import path from "path";

// 🟢 Create or Update Section
export const upsertAboutSection = async (req, res) => {
  try {
    const { sectionKey, title, content, extraData } = req.body;

    if (
      req.file &&
      !["image/jpeg", "image/png", "image/webp"].includes(req.file.mimetype)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only JPG, PNG, WEBP allowed" });
    }

    const imageFile = req.file ? req.file.filename : null;

    if (!sectionKey) {
      return res
        .status(400)
        .json({ success: false, message: "Section key is required" });
    }

    const existing = await AboutContent.findOne({ sectionKey });

    // For new sections, image is mandatory
    if (!existing && !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image is required for new section",
      });
    }

    // Delete old image if new one is uploaded
    if (imageFile && existing && existing.image) {
      const oldImagePath = path.join("uploads/", existing.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    const updateFields = { title, content, extraData };
    if (imageFile) updateFields.image = imageFile;

    const updated = await AboutContent.findOneAndUpdate(
      { sectionKey },
      updateFields,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: existing
        ? "Section updated successfully"
        : "Section created successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error in upsertAboutSection:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error saving section",
    });
  }
};

// 🟣 Get All Sections
export const getAllAboutSections = async (req, res) => {
  try {
    const sections = await AboutContent.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔵 Get One Section by key
export const getSectionByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const section = await AboutContent.findOne({ sectionKey: key });

    if (!section)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    res.status(200).json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟠 Update existing About section by ID
export const updateAboutContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, extraData } = req.body;

    const updated = await AboutContent.findByIdAndUpdate(
      id,
      { title, content, image, extraData },
      { new: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });

    res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔴 Delete Section
export const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    await AboutContent.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Section deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  upsertAboutSection,
  getAllAboutSections,
  getSectionByKey,
  updateAboutContent,
  deleteSection,
};
