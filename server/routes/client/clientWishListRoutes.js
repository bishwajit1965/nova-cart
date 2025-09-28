import {
  addToWishList,
  getWishList,
  removeFromWishList,
} from "../../controllers/client/wishListController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

// All routes require authentication
router.use(authenticationMiddleware);
// Get current user's wish list
router.get("/", getWishList);
// Add product to wish list
router.post("/", addToWishList);
// Remove product from wish list
router.delete("/:productId", removeFromWishList);
// Export the router

export default router;
