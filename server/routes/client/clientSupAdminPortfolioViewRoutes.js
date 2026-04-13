import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  getPortfolios,
  generatePortfolioPDF,
} from "../../controllers/client/clientSupAdmPortfolioViewController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin", "user", "admin"));

router.get("/get-portfolios", getPortfolios);

router.get("/:id/pdf", generatePortfolioPDF);

export default router;
