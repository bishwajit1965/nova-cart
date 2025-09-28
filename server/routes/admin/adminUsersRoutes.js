import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  getUsersStats,
  softDeleteUser,
  updateUserStatus,
} from "../../controllers/admin/adminUserController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/user-status-summary",
  authorizeRole("admin", "super-admin"),
  getUsersStats
);

router.get("/", authorizeRole("admin", "super-admin"), getAllUsers);

router.get("/:id", authorizeRole("admin", "super-admin"), getUserById);

router.patch("/:id", authorizeRole("admin", "super-admin"), updateUserStatus);

router.delete("/:id", authorizeRole("admin", "super-admin"), softDeleteUser);

export default router;
