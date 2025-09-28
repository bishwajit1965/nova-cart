import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getAllOrders,
  getOrderDetails,
  getOrderStatus,
  getOrdersOverTime,
  getRevenueSummary,
  updateOrderStatus,
} from "../../controllers/admin/adminOrderController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/status-summary",
  authorizeRole("admin", "super-admin"),
  getOrderStatus
);

router.get(
  "/orders-over-time",
  authorizeRole("admin", "super-admin"),
  getOrdersOverTime
);

router.get(
  "/revenue-summary",
  authorizeRole("admin", "super-admin"),
  getRevenueSummary
);

router.get("/", authorizeRole("super-admin", "admin"), getAllOrders);

router.get(
  "/:orderId/status",
  authorizeRole("super-admin", "admin"),
  getOrderDetails
);

router.patch(
  "/:orderId",
  authorizeRole("super-admin", "admin"),
  updateOrderStatus
);

export default router;
