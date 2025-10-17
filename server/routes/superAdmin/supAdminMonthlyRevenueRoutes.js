import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { getSuperAdminMonthlyRevenue } from "../../controllers/superAdmin/supAdminMonthlyRevenueController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/monthly-revenue", getSuperAdminMonthlyRevenue);

export default router;
