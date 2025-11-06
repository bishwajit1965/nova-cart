import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  getActiveAnnouncements,
  updateAnnouncement,
} from "../../controllers/superAdmin/supAdminAnnouncementController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin"));

// Create Announcement
router.post("/announcement-create", createAnnouncement);

// Update Announcement
router.patch("/announcement-edit/:id", updateAnnouncement);

// Delete Announcement
router.delete("/announcement-delete/:id", deleteAnnouncement);

// Get All Active Announcements
router.get("/all/active", getActiveAnnouncements);

export default router;
