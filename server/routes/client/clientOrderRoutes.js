import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  cancelOrder,
  createOrder,
  downloadInvoice,
  getClientOrders,
  getMyOrders,
  getOrderById,
  getOrdersForUser,
} from "../../controllers/client/clientOrderController.js";

import express from "express";

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Get user orders for profile
router.get("/my-orders", authorizeRole("user"), getMyOrders);

// Get orders by user ID and status
router.get("/", getClientOrders);

// Create a new order
router.post("/", authorizeRole("super-admin", "admin", "user"), createOrder);
router;

// Download Invoice PDF
router.get(
  "/:orderId/invoice",
  authorizeRole("super-admin", "admin", "user"),
  downloadInvoice
);

// Get specific order by orderId
router.get(
  "/:orderId",
  authorizeRole("super-admin", "admin", "user"),
  getOrderById
);

// Get user orders
router.get(
  "/user/:userId",
  authorizeRole("super-admin", "admin", "user"),
  getOrdersForUser
);

//Cancel order
router.patch(
  "/:orderId",
  authorizeRole("super-admin", "admin", "user"),
  cancelOrder
);

export default router;
