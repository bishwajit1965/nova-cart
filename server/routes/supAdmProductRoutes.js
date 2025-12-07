import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  seedProducts,
  updateProduct,
} from "../controllers/superAdmin/supAdmProductController.js";

import express from "express";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  getAllProducts
);

router.post(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  upload.any(),
  // upload.array("images", 5),
  createProduct
);

router.get(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  getProductById
);

router.patch(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  upload.any(),
  // upload.array("images", 5),
  updateProduct
);

router.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  deleteProduct
);

// router.post("/", seedProducts);

export default router;
