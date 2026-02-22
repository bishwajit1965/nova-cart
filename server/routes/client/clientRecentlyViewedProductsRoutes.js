import express from "express";

import {
  saveRecentlyViewedProduct,
  getRecentlyViewedProductsByIds,
  getRecentlyViewedProductsFromDB,
  removeFromRecentlyViewed,
} from "../../controllers/client/clientRecentlyViewedProductsController.js";

import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/products", saveRecentlyViewedProduct);

router.get("/products", getRecentlyViewedProductsByIds);

router.get("/", getRecentlyViewedProductsFromDB);

// Remove a product from cart
router.delete(
  "/products/:productId/:variantId",
  authorizeRole("super-admin", "admin", "user"),
  removeFromRecentlyViewed,
);

// Variantless product delete
router.delete(
  "/products/:productId",
  authorizeRole("super-admin", "admin", "user"),
  removeFromRecentlyViewed,
);

// router.delete("/products", removeFromRecentlyViewed);
export default router;
