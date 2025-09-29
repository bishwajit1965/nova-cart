import { JWT } from "../utils/constants.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ----> Authentication Middleware ---->
export const authenticationMiddleware = async (req, res, next) => {
  console.log("🔐 Incoming request to:", req.originalUrl);

  try {
    console.log("📨 All headers:", req.headers);

    // 1️⃣ Check Authorization header
    let token;
    const authHeader = req.headers?.authorization;
    if (authHeader?.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Fallback: check JWT cookie
    if (!token && req.cookies?.[JWT.COOKIE_NAME]) {
      token = req.cookies[JWT.COOKIE_NAME];
      console.log("🍪 Token from cookie:", token);
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 4️⃣ Verify access token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT.ACCESS_SECRET);
    } catch (err) {
      // If access token expired, try refresh token
      if (err.name === "TokenExpiredError") {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          return res
            .status(401)
            .json({ message: "Token expired. Please login again." });
        }

        try {
          const refreshDecoded = jwt.verify(refreshToken, JWT.REFRESH_SECRET);
          // Attach user ID from refresh token
          decoded = { id: refreshDecoded.id };
          console.log("♻️ Token refreshed, decoded user id:", decoded.id);
        } catch (refreshErr) {
          console.error("❌ Refresh token error:", refreshErr.message);
          return res
            .status(401)
            .json({ message: "Invalid refresh token. Please login again." });
        }
      } else {
        console.error("❌ Token verification error:", err.message);
        return res.status(401).json({ message: "Invalid token" });
      }
    }

    // 5️⃣ Fetch user from DB
    const user = await User.findById(decoded.id).populate({
      path: "roles",
      select: "name",
      populate: { path: "permissions" },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Normalize roles & permissions
    const roleNames = (user.roles || []).map((r) => r.name);
    const permissions = Array.from(
      new Set(
        (user.roles || [])
          .flatMap((r) => (r.permissions || []).map((p) => p.key))
          .filter(Boolean)
      )
    );

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      roles: roleNames,
      permissions,
      isActive: user.isActive,
    };

    console.log("✅ Authenticated user object:", req.user);
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Permission check helper
export const authorizePermission =
  (...required) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const hasAll = required.every((r) => req.user.permissions.includes(r));
    if (!hasAll)
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    next();
  };

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

export default {
  authenticationMiddleware,
  authorizePermission,
  authorizeRole,
};
