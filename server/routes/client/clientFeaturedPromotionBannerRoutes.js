import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import { getAllFeaturedPromotionBanners } from "../../controllers/client/clientFeaturedPromotionBannerController.js";

import express from "express";

const router = express.Router();

router.get("/", getAllFeaturedPromotionBanners);

export default router;
