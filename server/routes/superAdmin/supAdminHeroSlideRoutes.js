import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createHeroSlide,
  deleteHeroSlide,
  getAllHeroSlides,
  updateHeroSlide,
} from "../../controllers/superAdmin/supAdminHeroSlideController.js";

import express from "express";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin", "admin"));

router.get("/", getAllHeroSlides);

router.post("/", upload.single("image"), createHeroSlide);

router.patch("/:id", upload.single("image"), updateHeroSlide);

router.delete("/:id", deleteHeroSlide);

export default router;
