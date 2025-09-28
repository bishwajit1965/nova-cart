// routes/superAdmin/superAdminOrderRoutes.js

import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  cancelOrder,
  createOrder,
  downloadInvoice,
  getAllOrders,
  orderDetails,
  updateOrderStatus,
} from "../../controllers/superAdmin/superAdminOrderController.js";

import express from "express";

const router = express.Router();

// Common authentication Check
router.use(authenticationMiddleware);

// Place order
router.post("/", authorizeRole("super-admin", createOrder));

// Fetch all orders
router.get("/", authorizeRole("super-admin"), getAllOrders);

// Update order status
router.patch("/:orderId", authorizeRole("super-admin"), updateOrderStatus);

// Cancel order
router.patch(
  "/:orderId/cancel-order",
  authorizeRole("super-admin"),
  cancelOrder
);

// Get order status history
router.get("/:orderId", authorizeRole("super-admin", orderDetails));

// Download Invoice PDF
router.get(
  "/:orderId/invoice",
  authorizeRole("super-admin", "admin", "user"),
  downloadInvoice
);

export default router;
