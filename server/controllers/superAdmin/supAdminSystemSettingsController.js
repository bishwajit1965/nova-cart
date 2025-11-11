import SystemSettings from "../../models/SystemPreferenceSettings.js";
import User from "../../models/User.js";
import fs from "fs";
import path from "path";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error in fetching user", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfileInfo = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const { id } = req.params;

    const updateDocs = {};
    if (name) updateDocs.name = name;
    if (email) updateDocs.email = email;
    if (avatar) updateDocs.avatar = avatar;
    const updatedUser = await User.findByIdAndUpdate(id, updateDocs, {
      new: true,
    }).select("-password");

    if (!updatedUser)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in updating profile", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });

    // Update password
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSystemPreferences = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({});
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.status(200).json({
      success: true,
      message: "Settings created successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("Error in fetching system preferences!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateSystemPreferences = async (req, res) => {
  try {
    const { id } = req.params;

    const parsedData =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    const files = {};
    if (req.files?.logo) files.logo = req.files.logo[0].filename;
    if (req.files?.favicon) files.favicon = req.files.favicon[0].filename;

    const updateData = { ...parsedData, ...files };

    // Handle JSON-encoded nested objects
    if (typeof updateData.paymentGateways === "string") {
      try {
        updateData.paymentGateways = JSON.parse(updateData.paymentGateways);
      } catch {
        console.warn("⚠️ Could not parse paymentGateways JSON");
      }
    }

    if (typeof updateData.socialLinks === "string") {
      try {
        updateData.socialLinks = JSON.parse(updateData.socialLinks);
      } catch {
        console.warn("⚠️ Could not parse socialLinks JSON");
      }
    }

    // Find existing settings
    let settings = await SystemSettings.findById(id);

    if (!settings) {
      settings = await SystemSettings.create(updateData);
    } else {
      // 🧹 Delete old files if new ones are uploaded
      const uploadDir = path.join("uploads"); // adjust if needed

      if (files.logo && settings.logo) {
        const oldLogoPath = path.join(uploadDir, settings.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }

      if (files.favicon && settings.favicon) {
        const oldFaviconPath = path.join(uploadDir, settings.favicon);
        if (fs.existsSync(oldFaviconPath)) fs.unlinkSync(oldFaviconPath);
      }

      // Update with new data
      settings = await SystemSettings.findByIdAndUpdate(id, updateData, {
        new: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "System preferences updated successfully",
      data: settings,
    });
  } catch (error) {
    console.error("Error in updating system preferences!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const toggleMaintenanceMode = async (req, res) => {
  try {
    const { maintenanceMode } = req.body; // true / false
    const settings = await SystemSettings.findOneAndUpdate(
      {},
      { maintenanceMode },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: maintenanceMode
        ? "🛠️ Maintenance mode enabled"
        : "✅ Maintenance mode disabled",
      data: settings,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export default {
  updateProfileInfo,
  updatePassword,
  getSystemPreferences,
  updateSystemPreferences,
  toggleMaintenanceMode,
};
