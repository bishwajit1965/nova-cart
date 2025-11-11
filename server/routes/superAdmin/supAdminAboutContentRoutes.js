import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  deleteSection,
  getAllAboutSections,
  getSectionByKey,
  updateAboutContent,
  upsertAboutSection,
} from "../../controllers/superAdmin/supAdminAboutContentController.js";

import express from "express";
import { upload } from "../../middlewares/upload.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.use(authorizeRole("super-admin", "user"));

router.get("/about-content", getAllAboutSections);

router.get("/:sectionKey", getSectionByKey);

router.post("/add", upload.single("image"), upsertAboutSection);

router.patch("/:sectionKey/edit", upload.single("image"), upsertAboutSection);

router.delete("/:id/delete-about-content", deleteSection);

export default router;
