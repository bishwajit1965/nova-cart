import { authenticationMiddleware } from "../../middlewares/authMiddleware.js";
import express from "express";
import { getBillingSummary } from "../../controllers/superAdmin/supAdminBillingController.js";

const router = express.Router();
router.use(authenticationMiddleware);

router.get("/", getBillingSummary);

export default router;
