import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { featureGuard } from "../../middlewares/featureGuard.js";
import { getAllPlanHistory } from "../../controllers/client/clientPlanHistoryController.js";
import { requireFeature } from "../../middlewares/requireFeature.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Get current user's wish list
router.get("/", getAllPlanHistory);

export default router;
