import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getProfile,
  getSystemPreferences,
  toggleMaintenanceMode,
  updatePassword,
  updateProfileInfo,
  updateSystemPreferences,
} from "../../controllers/superAdmin/supAdminSystemSettingsController.js";

import express from "express";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Profile get and update related routes
router.get(
  "/profile/get-profile",
  authorizeRole("super-admin", "user"),
  getProfile
);

router.patch(
  "/profile/:id/update-profile",
  authorizeRole("super-admin"),
  updateProfileInfo
);

// Password update related route
router.patch(
  "/password/:id/update-password",
  authorizeRole("super-admin"),
  updatePassword
);

// Get system preference & update
router.get(
  "/preference/get-create",
  authorizeRole("super-admin"),
  getSystemPreferences
);

router.patch(
  "/preference/:id/update-preference",
  authorizeRole("super-admin"),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSystemPreferences
);

router.patch(
  "/maintenance",
  authorizeRole("super-admin"),
  toggleMaintenanceMode
);

export default router;
