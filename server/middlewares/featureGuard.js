// middlewares/featureGuard.js

import User from "../models/User.js";

export const featureGuard = () => {
  return async (req, res, next) => {
    try {
      // If no route has defined a feature requirement, skip check
      const featureKey = req.requiredFeature;
      if (!featureKey) return next();

      const user = await User.findById(req.user._id)
        .populate({
          path: "plan",
          populate: { path: "features" },
        })
        .populate("roles");

      // Bypass feature check for admins
      const elevatedRoles = ["admin", "super-admin", "editor"]; // roles that bypass feature guard
      const hasElevatedRole = user.roles.some((role) =>
        elevatedRoles.includes(role.name)
      );

      if (hasElevatedRole) return next();

      if (!user?.plan) {
        return res.status(403).json({
          success: false,
          message: "You don't have any active plan!",
        });
      }

      const featureKeys = user.plan.features.map((f) => f.key);

      if (!featureKeys.includes(featureKey)) {
        return res.status(403).json({
          success: false,
          message: `Access denied: '${featureKey}' not included in your plan.`,
        });
      }

      next();
    } catch (error) {
      console.error("Feature guard error:", error);
      res.status(500).json({ success: false, message: "Server error!" });
    }
  };
};
