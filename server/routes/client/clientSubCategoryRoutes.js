import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategories,
  getSubCategoriesById,
  updateSubCategory,
} from "../../controllers/client/clientSubCategoryController.js";

import express from "express";

const router = express.Router();

// Common authorization check for all routes
router.use(authenticationMiddleware);

// Routes hit by APIs
router.post(
  "/",
  authorizeRole("super-admin", "admin", "user"),
  createSubCategory
);

router.get(
  "/",
  authorizeRole("super-admin", "admin", "user"),
  getSubCategories
);

router.get(
  "/:id",
  authorizeRole("super-admin", "admin", "user"),
  getSubCategoriesById
);

router.patch(
  "/:id",
  authorizeRole("super-admin", "admin", "user"),
  updateSubCategory
);

router.delete(
  "/:id",
  authorizeRole("super-admin", "admin", "user"),
  deleteSubCategory
);

export default router;
