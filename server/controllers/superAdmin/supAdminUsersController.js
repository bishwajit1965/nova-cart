import Role from "../../models/Role.js";
import User from "../../models/User.js";

/**
 * Get all active users (optionally include inactive)
 * @param {*} req
 * @param {*} res
 * @returns data:users
 */
export const getAllUsers = async (req, res) => {
  try {
    // Only fetch users with role 'user' (populate role)
    const users = await User.find({ status: { $ne: "inactive" } })
      .populate("roles", "name")
      .select("-password");

    if (!users || users.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No users found!" });

    // Filter to ensure role is 'user'
    const filteredUsers = users.filter(
      (u) =>
        u.roles.some((role) => role.name === "user") &&
        !u.roles.some((role) => role.name === "super-admin")
    );

    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: filteredUsers || [],
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Get single user by ID
 * @param {*} req
 * @param {*} res
 * @returns data:user
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      status: { $ne: "inactive" },
    })
      .populate("roles", "name")
      .select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Update user status (active/inactive/banned)
 * @param {*} req
 * @param {*} res
 * @returns data:user
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    )
      .populate("roles", "name permissions")
      .select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User status updated successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/**
 * Soft delete a user (set status to inactive)
 * @param {*} req
 * @param {*} res
 * @returns data:user
 */
export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { status: "inactive" },
      { new: true }
    )
      .populate("roles", "name")
      .select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "User soft-deleted successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error soft deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getUsersStats = async (req, res) => {
  try {
    // Count total users with role "user"
    const totalUsers = await User.countDocuments({
      roles: { $in: await Role.find({ name: "user" }).distinct("_id") },
    });

    // Count active users
    const activeUsers = await User.countDocuments({
      roles: { $in: await Role.find({ name: "user" }).distinct("_id") },
      status: "active",
    });

    // Count inactive users
    const inactiveUsers = await User.countDocuments({
      roles: { $in: await Role.find({ name: "user" }).distinct("_id") },
      status: "inactive",
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
    });
  } catch (error) {
    console.error("Error fetching users stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getUsersStats,
  softDeleteUser,
};
