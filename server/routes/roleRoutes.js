import {
  createRole,
  deleteRole,
  getRoleById,
  getRoles,
  seedRoles,
  updateRole,
} from "../controllers/superAdmin/roleController.js";

import express from "express";

const router = express.Router();

router.get("/", getRoles);
router.post("/", createRole);
router.get("/:id", getRoleById);
router.patch("/:id", updateRole);
router.delete("/:id", deleteRole);

// Seeder route
router.post("/seed", seedRoles);

export default router;
