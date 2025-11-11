import express from "express";
import { googleAuth } from "../../controllers/auth/googleController.js";

const router = express.Router();

router.post("/", googleAuth);

export default router;
