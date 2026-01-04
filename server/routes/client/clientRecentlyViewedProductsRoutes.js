import express from "express";

import {
  saveRecentlyViewedProduct,
  getRecentlyViewedProductsByIds,
  getRecentlyViewedProductsFromDB,
} from "../../controllers/client/clientRecentlyViewedProductsController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/products", saveRecentlyViewedProduct);

router.get("/products", getRecentlyViewedProductsByIds);

router.get("/", getRecentlyViewedProductsFromDB);

export default router;
