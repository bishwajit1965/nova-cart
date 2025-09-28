import {
  addToCart,
  getAllCarts,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/superAdmin/cartController.js";

import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Get current user's cart
router.get("/", getCart);

router.get("/", getAllCarts);

// Add product to cart
router.post("/", addToCart);

// Update quantity of a specific product
router.patch("/:productId", updateCartItem);

// Remove a product from cart
router.delete("/:productId", removeFromCart);

export default router;
