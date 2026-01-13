import {
  getAllProducts,
  getBestSellers,
  getProductById,
  getProducts,
  getRandomProducts,
} from "../../controllers/client/client.product.controller.js";

import express from "express";

const router = express.Router();

router.get("/", getProducts);

router.get("/all", getAllProducts);

router.get("/best-sellers", getBestSellers);

router.get("/random", getRandomProducts);

router.get("/:id", getProductById);

export default router;
