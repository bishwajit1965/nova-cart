import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createPortfolio,
  deletePortfolio,
  // generatePdf,
  getPortfolioById,
  getPortfolios,
  updatePortfolio,
  generatePortfolioPDF,
} from "../../controllers/superAdmin/supAdminPortfolioController.js";

import express from "express";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin"));

// Public: get all
router.get("/get-portfolios", getPortfolios);

// Public: single
router.get("/:id", getPortfolioById);

// PDF generation (public or protected as you like)
router.get("/:id/pdf", generatePortfolioPDF);

// Protected: create / update / delete
router.post("/add", upload.single("profileImage"), createPortfolio);

router.patch("/:id/edit", upload.single("profileImage"), updatePortfolio);

router.delete("/:id/delete-portfolio", deletePortfolio);

export default router;
