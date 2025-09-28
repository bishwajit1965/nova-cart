import {
  createContact,
  getAllContacts,
} from "../../controllers/client/clientContactController.js";

import express from "express";

const router = express.Router();
router.post("/", createContact);
router.get("/", getAllContacts);
export default router;
