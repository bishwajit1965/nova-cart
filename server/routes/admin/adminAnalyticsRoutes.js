// routes/admin/adminAnalyticsRoutes.js

import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

import express from "express";
import { getAdminUsersAnalytics } from "../../controllers/admin/AdminAnalyticsController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizeRole("admin", "super-admin"), getAdminUsersAnalytics);

export default router;
