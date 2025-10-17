import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { getSuperAdminRevenueAnalytics } from "../../controllers/superAdmin/supAdminRevenueAnalyticsController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/weekly-revenue", getSuperAdminRevenueAnalytics);

export default router;
