import { getActiveAnnouncements } from "../../controllers/client/clientAnnouncementController.js";

import express from "express";

const router = express.Router();

// Get All Active Announcements
router.get("/all/active", getActiveAnnouncements);

export default router;
