import {
  createPlan,
  deletePlan,
  getAllPlans,
  updatePlan,
} from "../../controllers/superAdmin/supAdminPlanController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/", createPlan);

router.get("/all", getAllPlans);

router.patch("/:id/edit", updatePlan);

router.delete("/:id/delete", deletePlan);

export default router;
