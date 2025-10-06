import {
  captureOrder,
  createOrder,
} from "../../controllers/client/clientCheckoutController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/create-order", createOrder);

router.post("/capture-order", captureOrder);

export default router;
