import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createAuditLog,
  getAuditLogById,
  getAuditLogs,
  updateProduct,
} from "../../controllers/superAdmin/supAdmAuditLogController.js";

import express from "express";

const router = express.Router();

router.use(authenticationMiddleware);

router.get("/", authorizeRole("super-admin", "admin"), getAuditLogs);
router.post("/", authorizeRole("super-admin", "admin"), createAuditLog);
router.get("/:id", authorizeRole("super-admin", "admin"), getAuditLogById);
router.patch("/:id", authorizeRole("super-admin", "admin"), updateProduct);

export default router;
