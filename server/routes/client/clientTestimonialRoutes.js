import {
  createTestimonial,
  getAllTestimonials,
} from "../../controllers/client/clientTestimonialController.js";

import express from "express";

const router = express.Router();

router.post("/", createTestimonial);
router.get("/", getAllTestimonials);

export default router;
