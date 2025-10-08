import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getMe,
  updateProfile,
} from "../../controllers/client/clientProfileController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizeRole("user"), getMe);

router.patch("/:userId", authorizeRole("user"), updateProfile);

export default router;
