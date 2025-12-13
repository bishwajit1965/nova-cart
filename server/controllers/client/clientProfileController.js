import User from "../../models/User.js";

export const getMe = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password -refreshToken");

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
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "name avatar email phone"
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// UPDATE profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { name, email, phone } = req.body; // your frontend sends userData
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      message: "Profile updated successfully!",
      data: user,
      new: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export default { getMe, updateProfile };
