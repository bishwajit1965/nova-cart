import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../../controllers/superAdmin/supAdminProjectController.js";

import express from "express";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin"));

// Public: get all
router.get("/get-projects", getProjects);

// Public: single
router.get("/:id", getProjectById);

// Protected: create / update / delete
router.post("/add-project", upload.single("projectImage"), createProject);

router.patch("/:id/edit-project", upload.single("projectImage"), updateProject);

router.delete("/:id/delete-project", deleteProject);

export default router;
