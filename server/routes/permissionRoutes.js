import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  seedPermissions,
  updatePermission,
} from "../controllers/superAdmin/permissionController.js";

import express from "express";

const router = express.Router();

router.get(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  authorizePermission("manage_users"),
  getAllPermissions
);
router.post("/", createPermission);
router.get("/:id", getPermission);
router.patch("/:id", updatePermission);
router.delete("/:id", deletePermission);
// Seeder route
router.post("/seed", seedPermissions);

export default router;
