import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/superAdmin/categoryController.js";

import express from "express";

const router = express.Router();

router.get("/", getCategories);

router.post(
  "/",
  authenticationMiddleware,
  authorizeRole("super-admin", "admin"),
  createCategory
);
router.patch(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin", "admin"),
  updateCategory
);
router.delete(
  "/:id",
  authenticationMiddleware,
  authorizeRole("super-admin"),
  deleteCategory
);

export default router;
