import {
  addToCart,
  getAllCarts,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../controllers/client/clientCartController.js";
import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

import express from "express";
import { featureGuard } from "../../middlewares/featureGuard.js";
import { requireFeature } from "../../middlewares/requireFeature.js";

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Get current user's cart
router.get("/", requireFeature("cart"), featureGuard(), getCart);

router.get("/all", requireFeature("cart"), featureGuard(), getAllCarts);

// Add product to cart
router.post(
  "/",
  requireFeature("cart"),
  featureGuard(),
  authorizeRole("super-admin", "admin", "user"),
  addToCart
);

// Update quantity of a specific product
router.patch(
  "/:productId",
  requireFeature("cart"),
  featureGuard(),
  authorizeRole("super-admin", "admin", "user"),
  updateCartItem
);

// Remove a product from cart
router.delete(
  "/:productId/:variantId",
  requireFeature("cart"),
  featureGuard(),
  authorizeRole("super-admin", "admin", "user"),
  removeFromCart
);

export default router;
