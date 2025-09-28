import Role from "../../models/Role.js";
import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate({
        path: "roles",
        populate: {
          path: "permissions",
          select: "name key description",
        },
      });
    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: users,
    });
  } catch (error) {
    console.error("Users not fetched", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.status(200).json({
      success: true,
      message: "User is fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error("User not fetched", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        role,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("User not updated", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

export const toggleUserActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
    }

    // Prevent super admin from being blocked
    if (user.roles === "super-admin") {
      return res
        .status(403)
        .json({ success: false, message: "Super admin can not be blocked!" });
    }
    user.isActive = !user.isActive;
    await user.save();
  } catch (error) {
    console.error("Toggling user active error!", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in setting user active status!",
    });
  }
};

export const assignUserRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles } = req.body; // roles = array of role IDs

    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: "Roles must be an array" });
    }

    // Validate roles exist
    const validRoles = await Role.find({ _id: { $in: roles } }).select("_id");

    if (validRoles.length !== roles.length) {
      return res.status(400).json({ message: "One or more roles are invalid" });
    }

    // Update user roles
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles: validRoles.map((r) => r._id) },
      { new: true }
    ).populate("roles", "name description");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User roles updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user roles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserActiveStatus,
  assignUserRoles,
};
