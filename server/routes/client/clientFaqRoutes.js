import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createFaq,
  deleteFaq,
  getFaq,
  getFaqs,
  updateFaq,
} from "../../controllers/client/clientFaqController.js";

import express from "express";

const router = express.Router();

// router.use(authenticationMiddleware);

// router.use(authorizeRole("super-admin"));

// router.post("/add", createFaq);

// router.get("/:id/single-faq", getFaq);

router.get("/all-faqs", getFaqs);

// router.patch("/:id/edit", updateFaq);

// router.delete("/:id/delete-faq", deleteFaq);

export default router;
