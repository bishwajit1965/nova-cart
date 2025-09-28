import {
  applyCoupon,
  generateCoupon,
  getCoupon,
} from "../../controllers/client/clientCouponController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", getCoupon);

router.post("/", generateCoupon);

router.patch("/:code", applyCoupon);

export default router;
