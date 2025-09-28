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

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Get current user's cart
router.get("/", getCart);

router.get("/all", getAllCarts);

// Add product to cart
router.post("/", authorizeRole("super-admin", "admin", "user"), addToCart);

// Update quantity of a specific product
router.patch(
  "/:productId",
  authorizeRole("super-admin", "admin", "user"),
  updateCartItem
);

// Remove a product from cart
router.delete(
  "/:productId",
  authorizeRole("super-admin", "admin", "user"),
  removeFromCart
);

export default router;
