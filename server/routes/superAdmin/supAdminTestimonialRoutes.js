// routes/admin/testimonialRoutes.js
import express from "express";
import {
  getAllTestimonials,
    approveTestimonial,
  updateTestimonialStatus,
  hideTestimonial,
  toggleFeaturedTestimonial,
  deleteTestimonial,
} from "../../controllers/superAdmin/supAdminTestimonialController.js";

import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizeRole("super-admin", "admin"), getAllTestimonials);

router.patch(
  "/:id/approve",
  authorizeRole("super-admin", "admin"),
  approveTestimonial
);

router.patch(
  "/:id/hide",
  authorizeRole("super-admin", "admin"),
  hideTestimonial
);

router.patch(
  "/:id/feature",
  authorizeRole("super-admin", "admin"),
  toggleFeaturedTestimonial
);
router.patch(
  "/:id/status",
  authorizeRole("super-admin", "admin"),
  updateTestimonialStatus
);

router.delete("/:id", authorizeRole("super-admin", "admin"), deleteTestimonial);

export default router;
