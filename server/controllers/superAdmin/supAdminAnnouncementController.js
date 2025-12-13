import Announcement from "../../models/Announcement.js";

// Create
export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);

    res.status(201).json({
      success: true,
      message: "Announcement has been created!",
      data: announcement,
    });
  } catch (error) {
    console.error("Error in creating data!", error);
    res.status(500).json({
      success: false,
      message: "Internal sever error while creating announcement!",
      error: error.message,
    });
  }
};

// Update
export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Announcement has been updated!",
      data: announcement,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Active
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
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
};
