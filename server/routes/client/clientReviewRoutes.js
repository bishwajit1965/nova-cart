import express from "express";
import {
  submitReview,
  getReviewsByProductId,
} from "../../controllers/client/clientProductReviewController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.use(authenticationMiddleware); // Apply auth middleware to all review routes

router.get("/:productId", getReviewsByProductId);

router.post("/", submitReview);

export default router;
