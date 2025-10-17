import AppConfig from "../../models/AppConfig.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    console.log("🎯 Get profile method is hit");
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
    console.log("🎯Update profile info method is hit");
    const { name, email, avatar } = req.body;
    const { id } = req.params;
    console.log("Id", id);
    console.log("REQ>BODY", req.body);

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

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    const isMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isMatched)
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error in updating profile", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const { theme, notifications, language } = req.body;
    const userId = req.user.id;
    const updatedDocs = { theme, notifications, language };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { preferences: updatedDocs },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Preferences updated successfully!",
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

export const updatePlatformConfig = async (req, res) => {
  try {
    const { appName, logo, contactEmail, currency } = req.body;
    let config = await AppConfig.findOne();
    if (!config) {
      config = await AppConfig.create({
        appName,
        logo,
        contactEmail,
        currency,
      });
    } else {
      config.appName = appName;
      config.logo = logo;
      config.contactEmail = contactEmail;
      config.currency = currency;
      await config.save();
    }
    res.status(200).json({
      success: true,
      message: "Platform configuration updated successfully",
      config,
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

export default {
  updateProfileInfo,
  changePassword,
  updatePreferences,
  updatePlatformConfig,
};
