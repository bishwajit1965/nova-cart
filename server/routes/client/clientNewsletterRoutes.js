import express from "express";
import { subscribeNewsletter } from "../../controllers/client/clientNewsletterController.js";

const router = express.Router();

router.post("/", subscribeNewsletter);

export default router;
