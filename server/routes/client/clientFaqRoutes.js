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

router.get("/all-faqs", getFaqs);

export default router;
