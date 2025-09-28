import {
  assignUserRoles,
  getAllUsers,
  getUserById,
  toggleUserActiveStatus,
  updateUser,
} from "../controllers/superAdmin/adminUserController.js";
import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../middlewares/authMiddleware.js";

import express from "express";

const router = express.Router();

router.get(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  getAllUsers
);

router.patch("/:id", assignUserRoles);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/toggle-block", toggleUserActiveStatus);

export default router;

// Check if middleware is working or not
// curl -H "Authorization: Bearer <YOUR_ACCESS_TOKEN AFTER LOGIN>" http://localhost:3000/api/admin/users
