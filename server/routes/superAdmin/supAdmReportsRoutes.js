import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getOrdersOverTime,
  getOrdersSummary,
  getProductsSummary,
  getUsersSummary,
} from "../../controllers/superAdmin/supAdmReportsController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/orders-summary", authorizeRole("super-admin"), getOrdersSummary);

router.get("/users-summary", authorizeRole("super-admin"), getUsersSummary);

router.get(
  "/products-summary",
  authorizeRole("super-admin"),
  getProductsSummary
);
router.get(
  "/orders-over-time",
  authorizeRole("super-admin"),
  getOrdersOverTime
);

export default router;
