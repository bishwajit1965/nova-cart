import {
  capturePayment,
  createPaymentIntent,
} from "../../controllers/client/clientStripeController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/:orderId/create-payment-intent", createPaymentIntent);

router.post("/capture", capturePayment);

export default router;
