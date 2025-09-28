import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSellers,
  getProductById,
  getProducts,
  seedProducts,
  updateProduct,
} from "../../controllers/client/client.product.controller.js";

import express from "express";

const router = express.Router();

router.get("/", getProducts);

router.get("/all", getAllProducts);

router.get("/best-sellers", getBestSellers);

router.post(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  createProduct
);
router.get("/:id", getProductById);
router.patch(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin", "user"),
  updateProduct
);
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin", "user"),
  deleteProduct
);

router.post("/", seedProducts);

export default router;
