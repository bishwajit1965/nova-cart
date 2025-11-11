import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  //   createHeroSlide,
  //   deleteHeroSlide,
  getAllFeaturedPromotionBanners,
  //   updateHeroSlide,
} from "../../controllers/client/clientFeaturedPromotionBannerController.js";

import express from "express";
// import { upload } from "../../middlewares/upload.js";

const router = express.Router();

// router.use(authenticationMiddleware);

// router.use(authorizeRole("super-admin", "admin"));

router.get("/", getAllFeaturedPromotionBanners);

// router.post("/", upload.single("image"), createHeroSlide);

// router.patch("/:id", upload.single("image"), updateHeroSlide);

// router.delete("/:id", deleteHeroSlide);

export default router;
