import User from "../../models/User.js";
import { JWT } from "../../utils/constants.js";

import { OAuth2Client } from "google-auth-library";
import generateTokens from "../../utils/generateTokens.js";

export const googleAuth = async (req, res) => {
  console.log("🎯 Google auth controller is hit!!");

  try {
    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: "No credential sent" });

    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ email }).populate({
      path: "roles",
      select: "name",
      populate: { path: "permissions" },
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar: picture,
        provider: "google",
      });
      // Populate roles for consistency
      await user.populate({
        path: "roles",
        select: "name",
        populate: { path: "permissions" },
      });
    } else if (user.provider !== "google") {
      // Update provider if previously local
      user.provider = "google";
      await user.save();
    }

    // Prepare roles & permissions for payload
    const roleNames = user.roles.map((r) => r.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.key)))
    );

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      name: user.name,
      email: user.email,
      roles: roleNames,
      permissions,
    });

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie(JWT.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return access token and user info
    res.status(200).json({
      accessToken,
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: roleNames,
        permissions,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
};

export default { googleAuth };
