import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createHeroSlide,
  deleteHeroSlide,
  getAllHeroSlides,
  updateHeroSlide,
} from "../../controllers/client/clientHeroSlidesController.js";

// import { upload } from "../../middlewares/upload.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin", "admin", "user"));

router.get("/", getAllHeroSlides);

export default router;
