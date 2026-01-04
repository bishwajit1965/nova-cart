import express from "express";

import { saveRecentlyViewedProduct } from "../../controllers/client/userActivityController.js";

import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/products", saveRecentlyViewedProduct); //active

export default router;
