// import {
//   COOKIE_NAME,
//   GOOGLE,
//   NODE_ENV,
//   REFRESH_TOKEN_SECRET,
// } from "../../utils/constants.js";

import { CLIENT, GOOGLE, JWT } from "../../utils/constants.js";

import Role from "../../models/Role.js";
import User from "../../models/User.js";
import axios from "axios";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateTokens from "../../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import qs from "qs";
import sendEmail from "../../utils/sendEmail.js";

// import { OAuth2Client } from "google-auth-library";

// const client = new OAuth2Client(GOOGLE.CLIENT_ID, GOOGLE.CLIENT_SECRET);

export const googleLogin = async (req, res) => {
  try {
    // use GOOGLE.CLIENT_ID & GOOGLE.CLIENT_SECRET here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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
      secure: process.env.NODE_ENV === "production",
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
      secure: NODE_ENV === "production",
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    return res.status(200).json({ message: "Logout is successful!" });
  } catch (error) {
    console.error("Logout error", error);
    return res.status(500).json("Internal server error.");
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "roles",
      populate: { path: "permissions" },
    });

    console.log("✅ ✅GET ME FETCHED+++>", user);

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
      secure: true,
      sameSite: "Strict",
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
// export const googleAuthController = async (req, res) => {
//   const { token } = req.body; // frontend should send { token }
//   if (!token) {
//     return res.status(400).json({ message: "Missing Google token" });
//   }

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId, picture } = payload;

//     let user = await User.findOne({ email })
//       .populate("roles")
//       .populate("permissions");

//     if (!user) {
//       const userRole = await Role.findOne({ name: "user" });
//       const defaultPermissions = await Permission.find({
//         name: { $in: ["create_products"] },
//       });

//       user = await User.create({
//         name,
//         email,
//         password: null,
//         googleId,
//         avatar: picture,
//         provider: "google",
//         roles: userRole ? [userRole._id] : [],
//         permissions: defaultPermissions.map((p) => p._id),
//         acceptedTerms: true,
//         acceptedAt: new Date(),
//         termsVersion: "v1.0",
//         signupIp: req.ip,
//       });

//       user = await User.findById(user._id)
//         .populate("roles")
//         .populate("permissions");
//     }

//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user._id);

//     user.refreshToken = refreshToken;
//     await user.save();

//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Google login successful",
//       accessToken,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         roles: user.roles.map((r) => r.name),
//         permissions: user.permissions.map((p) => p.name),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Google login error:", error);
//     res.status(401).json({ message: "Google login failed" });
//   }
// };

export const googleAuthController = async (req, res) => {
  const { token } = req.body; // frontend sends { token }
  if (!token) {
    return res.status(400).json({ message: "Missing Google token" });
  }

  try {
    // Verify token with centralized GOOGLE.CLIENT_ID
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    let user = await User.findOne({ email })
      .populate("roles")
      .populate("permissions");

    if (!user) {
      const userRole = await Role.findOne({ name: "user" });
      const defaultPermissions = await Permission.find({
        name: { $in: ["create_products"] },
      });

      user = await User.create({
        name,
        email,
        password: null,
        googleId,
        avatar: picture,
        provider: "google",
        roles: userRole ? [userRole._id] : [],
        permissions: defaultPermissions.map((p) => p._id),
        acceptedTerms: true,
        acceptedAt: new Date(),
        termsVersion: "v1.0",
        signupIp: req.ip,
      });

      user = await User.findById(user._id)
        .populate("roles")
        .populate("permissions");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles.map((r) => r.name),
        permissions: user.permissions.map((p) => p.name),
      },
    });
  } catch (error) {
    console.error("❌ Google login error:", error);
    res.status(401).json({ message: "Google login failed" });
  }
};

export const googleSignUpController = async (req, res) => {
  console.log("Sign up with Google called");
  const { code } = req.body;
  console.log("👉 Received code:", code);

  if (!code) {
    return res.status(400).json({ message: "Missing authorization code" });
  }

  try {
    // ✅ Exchange code for tokens
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify({
        code,
        client_id: GOOGLE.CLIENT_ID,
        client_secret: GOOGLE.CLIENT_SECRET,
        redirect_uri: "postmessage", // ⚠️ replace with real redirect_uri in production
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token } = tokenResponse.data;
    if (!id_token) {
      return res.status(401).json({ message: "ID token not received" });
    }

    // ✅ Verify ID token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: GOOGLE.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not found in token" });
    }

    let user = await User.findOne({ email })
      .populate("roles")
      .populate("permissions");

    // If user doesn’t exist, create one
    if (!user) {
      const userRole = await Role.findOne({ name: "user" });
      const defaultPermissions = await Permission.find({
        name: { $in: ["create_products"] },
      });

      user = await User.create({
        name,
        email,
        password: null,
        googleId,
        avatar: picture,
        provider: "google",
        roles: userRole ? [userRole._id] : [],
        permissions: defaultPermissions.map((p) => p._id),
        acceptedTerms: true,
        acceptedAt: new Date(),
        termsVersion: "v1.0",
        signupIp: req.ip,
      });

      user = await User.findById(user._id)
        .populate("roles")
        .populate("permissions");
    }

    // ✅ Generate tokens properly
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    // ✅ Send refreshToken as cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Google sign up successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles.map((role) => role.name),
        permissions: user.permissions.map((perm) => perm.name),
      },
    });
  } catch (error) {
    console.error("❌ Google Sign-up Error:", error?.response?.data || error);
    return res.status(401).json({ message: "Google sign up failed" });
  }
};

// export const googleAuthController = async (req, res) => {
//   const { code } = req.body;

//   try {
//     const tokenResponse = await axios.post(
//       "https://oauth2.googleapis.com/token",
//       qs.stringify({
//         code,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         redirect_uri: process.env.GOOGLE_REDIRECT_URI,
//         grant_type: "authorization_code",
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const { access_token, id_token } = tokenResponse.data;

//     const userInfo = await axios.get(
//       `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
//     );

//     const { email, name, picture, sub } = userInfo.data;
//     let user = await User.findOne({ email })
//       .populate("roles")
//       .populate("permissions");

//     // let user = await User.findOne({ email })
//     //   .populate("roles")
//     //   .populate("permissions")
//     //   .populate({
//     //     path: "plan",
//     //     select: "_id tier name features price createdAt updatedAt",
//     //     populate: { path: "features", select: "key title description icon" },
//     //   });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         avatar: picture,
//         provider: "google",
//         providerId: sub,
//         password: null,
//       });
//     }

//     // ✅ Generate access and refresh tokens
//     const accessToken = generateTokens(user);
//     const refreshToken = generateTokens(user._id);
//     console.log("Access token=>", accessToken);
//     user.refreshToken = refreshToken;
//     await user.save();

//     // ✅ Set refreshToken cookie
//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     // ✅ Send access token + user info
//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         roles: user.roles.map((role) => role.name),
//         permissions: user.permissions.map((perm) => perm.name),
//         plan: serializePlan(user.plan),
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Google login failed",
//       error?.response?.data || error.message
//     );
//     res.status(401).json({ message: "Google login failed" });
//   }
// };

// export const googleSignUpController = async (req, res) => {
//   console.log("Sign up with Google called");
//   const { code } = req.body;
//   console.log("👉 Received code:", code);

//   if (!code) {
//     return res.status(400).json({ message: "Missing authorization code" });
//   }

//   try {
//     // ✅ Exchange code for token
//     const tokenResponse = await axios.post(
//       "https://oauth2.googleapis.com/token",
//       qs.stringify({
//         code,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         redirect_uri: "postmessage",
//         grant_type: "authorization_code",
//       }),
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     const { id_token } = tokenResponse.data;
//     if (!id_token) {
//       return res.status(401).json({ message: "ID token not received" });
//     }

//     // ✅ Verify ID token
//     const ticket = await client.verifyIdToken({
//       idToken: id_token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, sub: googleId, picture } = payload;

//     if (!email) {
//       return res.status(400).json({ message: "Email not found in token" });
//     }

//     let user = await User.findOne({ email })
//       .populate("roles")
//       .populate("permissions");

//     // let user = await User.findOne({ email })
//     //   .populate("roles")
//     //   .populate("permissions")
//     //   .populate({
//     //     path: "plan",
//     //     select: "_id tier name features price createdAt updatedAt",
//     //     populate: { path: "features", select: "key title description icon" },
//     //   });

//     console.log("GOOGLE USER", user);
//     const userRole = await Role.findOne({ name: "user" });
//     // const defaultPlan = await Plan.findOne({ tier: "free" });
//     const defaultPermissions = await Permission.find({
//       name: { $in: ["create_products"] },
//     });
//     console.log("userRole found:", userRole);

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         password: null,
//         googleId,
//         avatar: picture,
//         provider: "google",
//         roles: userRole ? [userRole._id] : [],
//         permissions: defaultPermissions.map((p) => p._id),
//         // plan: defaultPlan ? defaultPlan._id : null,
//         acceptedTerms: true,
//         acceptedAt: new Date(),
//         termsVersion: "v1.0",
//         signupIp: req.ip, // ✅ stores IP
//       });

//       user = await User.findById(user._id)
//         .populate("roles")
//         .populate("permissions");
//       // user = await User.findById(user._id)
//       //   .populate("roles")
//       //   .populate("permissions")
//       //   .populate({
//       //     path: "plan",
//       //     select: "_id tier name features price createdAt updatedAt",
//       //     populate: { path: "features", select: "key" },
//       //   });
//     }

//     const accessToken = generateTokens(user);
//     const refreshToken = generateTokens(user._id);

//     user.refreshToken = refreshToken;
//     await user.save();

//     res.cookie("jwt", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Google sign up is successful",
//       accessToken,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         avatar: user.avatar,
//         roles: user.roles.map((role) => role.name),
//         permissions: user.permissions.map((perm) => perm.name),
//         // plan: serializePlan(user.plan),
//       },
//     });
//   } catch (error) {
//     console.error("❌ Google Sign-up Error:", error?.response?.data || error);
//     return res.status(401).json({ message: "Google sign up failed" });
//   }
// };

export const facebookAuthController = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json({ message: "Facebook access token is required" });
  }

  try {
    // Fetch Facebook user info
    const fbRes = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: "id,name,email,picture",
        access_token: token,
      },
    });

    const { email, name, id: facebookId, picture } = fbRes.data;

    if (!email) {
      return res.status(400).json({ message: "Email permission is required" });
    }

    // Lookup user
    let user = await User.findOne({ $or: [{ email }, { facebookId }] })
      .populate("roles")
      .populate("permissions")
      .populate({
        path: "plan",
        populate: { path: "features", select: "key title description icon" },
      });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found, please sign up first" });
    }

    // Generate tokens
    const accessToken = generateTokens(user);
    const refreshToken = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    // Set cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Respond
    res.status(200).json({
      message: "Facebook login successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || picture?.data?.url,
        roles: user.roles.map((r) => r.name),
        permissions: user.permissions.map((p) => p.name),
        plan: serializePlan(user.plan),
      },
    });
  } catch (error) {
    console.error(
      "Facebook Login Error:",
      error.response?.data || error.message
    );
    return res.status(401).json({ message: "Facebook login failed" });
  }
};

export const facebookSignUpController = async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ message: "Facebook token required" });

  try {
    // 1. Get user info from Facebook
    const fbRes = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email,picture",
        access_token: token,
      },
    });

    const { email, name, id: facebookId, picture } = fbRes.data;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // 2. Check if user exists
    let user = await User.findOne({ email })
      .populate("roles")
      .populate("permissions")
      .populate({
        path: "plan",
        select: "_id tier name features price createdAt updatedAt",
        populate: { path: "features", select: "key title description icon" },
      });

    const userRole = await Role.findOne({ name: "user" });
    const defaultPlan = await Plan.findOne({ tier: "free" });
    const defaultPermissions = await Permission.find({
      name: { $in: ["create_post"] },
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: null,
        facebookId,
        avatar: picture?.data?.url || null,
        provider: "facebook",
        roles: userRole ? [userRole._id] : [],
        permissions: defaultPermissions.map((p) => p._id),
        plan: defaultPlan ? defaultPlan._id : null,
        acceptedTerms: true,
        acceptedAt: new Date(),
        termsVersion: "v1.0",
        signupIp: req.ip, // ✅ stores IP
      });

      user = await User.findById(user._id)
        .populate("roles")
        .populate("permissions")
        .populate({
          path: "plan",
          select: "_id tier name features price createdAt updatedAt",
          populate: { path: "features", select: "key title description icon" },
        });
    }

    // 3. Generate tokens
    const accessToken = generateTokens(user);
    const refreshToken = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 4. Send response
    res.status(200).json({
      message: "Facebook sign up successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles.map((r) => r.name),
        permissions: user.permissions.map((p) => p.name),
        plan: serializePlan(user.plan),
      },
    });
  } catch (error) {
    console.error("❌ Facebook Sign-up Error:", error?.response?.data || error);
    return res.status(500).json({ message: "Facebook sign up failed" });
  }
};

export default {
  register,
  refreshToken,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleAuthController,
  facebookAuthController,
  facebookSignUpController,
  googleSignUpController,
  getMe,
};
