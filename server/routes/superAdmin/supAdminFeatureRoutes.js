import {
  createFeature,
  deleteFeature,
  getAllFeatures,
  updateFeature,
} from "../../controllers/superAdmin/supAdminFeatureController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/", createFeature);

router.get("/all", getAllFeatures);

router.patch("/:id/edit", updateFeature);

router.delete("/:id/delete", deleteFeature);

export default router;
