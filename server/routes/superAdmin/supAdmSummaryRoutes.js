import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

import express from "express";
import { getAdminSummary } from "../../controllers/superAdmin/supAdmSummaryController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizeRole("super-admin"), getAdminSummary);

export default router;
