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

router.use(authenticationMiddleware);

router.get("/", requireFeature("wishlist"), featureGuard(), getWishList);

router.post("/", requireFeature("wishlist"), featureGuard(), addToWishList);

router.delete(
  "/:productId/:variantId",
  requireFeature("wishlist"),
  featureGuard(),
  removeFromWishList,
);

export default router;
