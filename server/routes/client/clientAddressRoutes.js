import {
  authenticationMiddleware,
  authorizeRole,
} from "../../middlewares/authMiddleware.js";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "../../controllers/client/clientAddressController.js";

import express from "express";

const router = express.Router();

// Will guard authentication for all routes
router.use(authenticationMiddleware);

router.get("/", authorizeRole("super-admin", "admin", "user"), getAddresses);
router.post("/", authorizeRole("super-admin", "admin", "user"), createAddress);
router.patch(
  "/:addressId",
  authorizeRole("super-admin", "admin", "user"),
  updateAddress
);

router.patch(
  "/set-default/:addressId",
  authorizeRole("super-admin", "admin", "user"),
  setDefaultAddress
);
router.delete(
  "/:addressId",
  authorizeRole("super-admin", "admin", "user"),
  deleteAddress
);

export default router;
