import express from "express";
import { facebookAuth } from "../../controllers/auth/facebookController.js";

const router = express.Router();

router.post("/", facebookAuth);

export default router;
