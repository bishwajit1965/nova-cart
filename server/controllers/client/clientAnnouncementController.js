import Announcement from "../../models/Announcement.js";

// Get All Active (Only this one is needed for frontend view)
export const getActiveAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: "Active announcements are fetched successfully!",
      data: announcements,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  getActiveAnnouncements,
};
