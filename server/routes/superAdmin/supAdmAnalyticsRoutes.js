import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getSalesOverview,
  getUsersGrowthOverview,
} from "../../controllers/superAdmin/supAdmSummaryController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/orders", authorizeRole("super-admin"), getSalesOverview);
router.get("/users", authorizeRole("super-admin"), getUsersGrowthOverview);

export default router;
