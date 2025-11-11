import User from "../../models/User.js";
import { JWT } from "../../utils/constants.js";
import axios from "axios";
import generateTokens from "../../utils/generateTokens.js";

export const facebookAuth = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken)
      return res.status(400).json({ message: "Facebook token is required" });

    // Verify token with Facebook
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { email, name, id, picture } = fbRes.data;

    if (!email)
      return res.status(400).json({
        message:
          "Facebook account does not provide email. Please use another login method.",
      });

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
        avatar: picture?.data?.url,
        provider: "facebook",
      });
      await user.populate({
        path: "roles",
        select: "name",
        populate: { path: "permissions" },
      });
    } else if (user.provider !== "facebook") {
      user.provider = "facebook";
      await user.save();
    }

    // Prepare roles & permissions
    const roleNames = user.roles.map((r) => r.name);
    const permissions = Array.from(
      new Set(user.roles.flatMap((r) => r.permissions.map((p) => p.key)))
    );

    // Generate tokens
    const { accessToken: jwtAccess, refreshToken } = generateTokens({
      id: user._id,
      name: user.name,
      email: user.email,
      roles: roleNames,
      permissions,
    });

    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token in httpOnly cookie
    res.cookie(JWT.COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken: jwtAccess,
      success: true,
      message: "Facebook login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: roleNames,
        permissions,
      },
    });
  } catch (err) {
    console.error("Facebook login error:", err);
    res.status(500).json({ message: "Facebook login failed" });
  }
};

export default { facebookAuth };
