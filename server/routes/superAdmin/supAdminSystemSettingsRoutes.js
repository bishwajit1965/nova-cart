import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  changePassword,
  getProfile,
  updatePlatformConfig,
  updatePreferences,
  updateProfileInfo,
} from "../../controllers/superAdmin/supAdminSystemSettingsController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/profile/get-profile", authorizeRole("super-admin"), getProfile);

router.patch(
  "/profile/:id/update-profile",
  authorizeRole("super-admin"),
  updateProfileInfo
);

router.patch("/update-password", authorizeRole("super-admin"), changePassword);

router.patch(
  "/update-preferences",
  authorizeRole("super-admin"),
  updatePreferences
);

router.patch(
  "/update-platform",
  authorizeRole("super-admin"),
  updatePlatformConfig
);

export default router;
