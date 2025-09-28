import {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getNonFeaturedCategories,
  updateCategory,
} from "../../controllers/client/clientCategoryController.js";

import express from "express";

const router = express.Router();

router.get("/", getCategories);

router.get("/non-featured", getNonFeaturedCategories);

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
