import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getUserPlan,
  subscribePlan,
  updateUserPlan,
} from "../../controllers/client/clientPlanSubscriptionController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/my-plan", authorizeRole("user"), getUserPlan);

router.post("/subscribe", authorizeRole("user"), subscribePlan);

router.patch("/update-plan", authorizeRole("user"), updateUserPlan);

export default router;
