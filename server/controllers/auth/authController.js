import { CLIENT, JWT, SERVER } from "../../utils/constants.js";

import Role from "../../models/Role.js";
import User from "../../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateTokens from "../../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import sendEmail from "../../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Find default "user" role
    const defaultRole = await Role.findOne({ name: "user" });
    if (!defaultRole) {
      return res
        .status(500)
        .json({ message: "Default role not found. Please seed roles first." });
    }

    // Create user with default role
    const user = await User.create({
      name,
      email,
      password, // will be hashed automatically via pre-save hook in User model
      roles: [defaultRole._id],
    });

    // Populate roles + permissions for token payload
    const populatedUser = await User.findById(user._id).populate({
      path: "roles",
      populate: { path: "permissions" },
    });

    // Flatten permissions keys array
    const permissions = populatedUser.roles.flatMap((role) =>
      role.permissions.map((p) => p.key)
    );

    // Generate access + refresh tokens
    const { accessToken, refreshToken } = generateTokens({
      id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      roles: populatedUser.roles.map((r) => r.name),
      permissions,
    });

    // ✅ Save refreshToken in DB
    populatedUser.refreshToken = refreshToken;
    await populatedUser.save();

    // Set refresh token cookie
    res.cookie(JWT.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: SERVER.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: populatedUser._id,
        name: populatedUser.name,
        email: populatedUser.email,
        roles: populatedUser.roles.map((r) => r.name),
        permissions,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).populate({
      path: "roles",
      select: "name",
      populate: { path: "permissions" },
    });

    console.log(
      "USER FOUND",
      JSON.stringify(user.toObject(), null, 2) // Converts Mongoose doc → plain object
    );

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or user inactive" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const roleNames = user.roles.map((r) => r.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.key)))
    );

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      name: user.name,
      email: user.email,
      roles: roleNames,
      permissions,
    });
    await User.updateOne({ _id: user._id }, { $set: { refreshToken } });

    console.log("ACCESS TOKEN:", accessToken);
    console.log("REFRESH TOKEN:", refreshToken);

    user.refreshToken = refreshToken;
    user.save();

    // Send refresh token in HTTP-only cookie
    res.cookie(JWT.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: SERVER.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles.map((r) => r.name),
        permissions: permissions,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie(JWT.COOKIE_NAME, {
      httpOnly: true,
      secure: SERVER.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Logout is successful!" });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json("Internal server error.");
  }
};

export const getMe = async (req, res) => {
  console.log("🎯 Get me controller method is hit!");
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      })
      .populate({
        path: "plan",
        populate: { path: "features" }, // <-- populate features here
      });
    console.log("User in get me", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      permissions: [
        ...new Set(
          user.roles.flatMap((r) => (r.permissions || []).map((p) => p.key))
        ),
      ],
      isActive: user.isActive,
      plan: user.plan
        ? {
            _id: user.plan._id,
            name: user.plan.name,
            features: user.plan.features.map((f) => ({
              key: f.key,
              title: f.title,
            })),
          }
        : null,
    });
  } catch (err) {
    console.error("ME endpoint error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies?.[JWT.COOKIE_NAME];
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, JWT.REFRESH_SECRET);
    console.log("DECODED", decoded);

    const user = await User.findById(decoded.id).populate({
      path: "roles",
      select: "name",
      populate: { path: "permissions" },
    });

    // ✅ Ensure token matches stored one
    if (!user || user.refreshToken !== token) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      id: user._id,
      roles: user.roles.map((r) => r.name),
      permissions: Array.from(
        new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.key)))
      ),
    });

    // ✅ Update stored refreshToken (optional rotation)
    user.refreshToken = newRefreshToken;
    await user.save();

    // ✅ Set new refreshToken cookie
    res.cookie(JWT.COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles.map((r) => r.name),
        permissions: Array.from(
          new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.key)))
        ),
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  let user;
  try {
    user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${CLIENT.URL}/reset-password/${resetToken}`;
    const message = `Click the link to reset your password: ${resetUrl}`;

    console.log("RESET URL:", resetUrl);
    console.log("Reset email will be sent to:", user.email);

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  console.log("🔐 Raw token from URL:", token);
  console.log("🔒 Hashed token for DB lookup:", tokenHash);

  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or expired" });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset" });
};

export default {
  register,
  refreshToken,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
