import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getUserPlan,
  subscribePlan,
} from "../../controllers/client/clientPlanSubscriptionController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/my-plan",
  authorizeRole("user", "admin", "editor", "super-admin"),
  getUserPlan
);

router.post(
  "/subscribe",
  authorizeRole("user", "admin", "editor", "super-admin"),
  subscribePlan
);

export default router;
