import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  cancelPlan,
  downgradePlan,
  getAllPlans,
  getUserPlan,
  subscribePlan,
  upgradePlan,
} from "../../controllers/client/clientPlanSubscriptionController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/all-plans",
  authorizeRole("user", "admin", "editor", "super-admin"),
  getAllPlans
);

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

router.patch(
  "/:userId/upgrade/:newPlanId",
  authorizeRole("user", "admin", "editor", "super-admin"),
  upgradePlan
);

router.patch(
  "/:userId/downgrade/:newPlanId",
  authorizeRole("user", "admin", "editor", "super-admin"),
  downgradePlan
);

router.patch(
  "/cancel/:userId",
  authorizeRole("user", "admin", "editor", "super-admin"),
  cancelPlan
);

export default router;
