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
} from "../../controllers/superAdmin/subCategoryController.js";

import express from "express";

const router = express.Router();

// Common authorization check for all routes
router.use(authenticationMiddleware);

// Routes hit by APIs
router.post("/", authorizeRole("super-admin", "admin"), createSubCategory);

router.get("/", authorizeRole("super-admin", "admin"), getSubCategories);

router.get("/:id", authorizeRole("super-admin", "admin"), getSubCategoriesById);

router.patch("/:id", authorizeRole("super-admin", "admin"), updateSubCategory);

router.delete("/:id", authorizeRole("super-admin", "admin"), deleteSubCategory);

export default router;
