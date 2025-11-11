import { getSystemPreferences } from "../../controllers/client/clientSystemSettingsController.js";

import express from "express";

const router = express.Router();

// Get system preference
router.get("/preference/get-create", getSystemPreferences);

export default router;
