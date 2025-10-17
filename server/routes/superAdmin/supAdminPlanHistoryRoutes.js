import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { getAllPlanHistories } from "../../controllers/superAdmin/supAdminPlanHistoryController.js";

const router = express.Router();
router.use(authenticationMiddleware);

router.get("/analytics", getAllPlanHistories);

export default router;
