import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createVendor,
  deleteVendor,
  getVendors,
  updateVendor,
} from "../../controllers/superAdmin/supAdminVendorController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware, authorizeRole("super-admin"));

router.post("/", createVendor);
router.get("/", getVendors);
router.patch("/:id/edit-vendor", updateVendor);
router.delete("/:id/delete-vendor", deleteVendor);

export default router;
