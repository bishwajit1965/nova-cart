import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  exportOrdersCSV,
  exportOrdersPDF,
  getRecentOrders,
  getRevenueOverTime,
  getTopProducts,
} from "../../controllers/admin/adminReportsController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get(
  "/top-products",
  authorizeRole("admin", "super-admin"),
  getTopProducts
);

router.get(
  "/recent-orders",
  authorizeRole("admin", "super-admin"),
  getRecentOrders
);

router.get(
  "/revenue-over-time",
  authorizeRole("admin", "super-admin"),
  getRevenueOverTime
);

router.get(
  "/export/csv",
  authorizeRole("admin", "super-admin"),
  exportOrdersCSV
);

router.get(
  "/export/pdf",
  authorizeRole("admin", "super-admin"),
  exportOrdersPDF
);

export default router;
