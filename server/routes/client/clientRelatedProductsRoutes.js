import express from "express";

import {
  getRelatedProducts,
  getProductById,
} from "../../controllers/client/clientRelatedProductsController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/products", getRelatedProducts);

router.get("/products/:productId", getProductById);

export default router;
