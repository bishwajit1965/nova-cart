import express from "express";
import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

import { getAllProjects } from "../../controllers/client/clientSupAdminProjectController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("user", "super-admin", "admin"));

router.get("/get-projects", getAllProjects);

export default router;
