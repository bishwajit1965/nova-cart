import {
  addToWishList,
  getWishList,
  removeFromWishList,
} from "../../controllers/client/wishListController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { featureGuard } from "../../middlewares/featureGuard.js";
import { requireFeature } from "../../middlewares/requireFeature.js";

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);

// Get current user's wish list
router.get("/", requireFeature("wishlist"), featureGuard(), getWishList);

// Add product to wish list
router.post("/", requireFeature("wishlist"), featureGuard(), addToWishList);

// Remove product from wish list
router.delete(
  "/:productId/:variantId",
  requireFeature("wishlist"),
  featureGuard(),
  removeFromWishList
);

// Export the router
export default router;
