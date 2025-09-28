import {
  facebookAuthController,
  forgotPassword,
  getMe,
  googleAuthController,
  googleSignUpController,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
} from "../controllers/auth/authController.js";

import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.get("/profile", authenticationMiddleware, (req, res) => {
  res.json({
    message: "This is a protected route",
    user: req.user, // comes from decoded token
  });
});
router.get("/me", authenticationMiddleware, getMe);
router.get("/refresh", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/oauth/google", googleAuthController);
router.post("/oauth/google-signup", googleSignUpController);
router.post("/oauth/facebook", facebookAuthController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
