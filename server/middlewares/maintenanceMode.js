import SystemSettings from "../models/SystemPreferenceSettings.js";

export const checkMaintenanceMode = async (req, res, next) => {
  const settings = await SystemSettings.findOne();

  if (settings?.maintenanceMode) {
    // Allow SuperAdmin only
    if (req.user && req.user.role === "super-admin") {
      return next();
    }

    return res.status(503).json({
      success: false,
      message: "🚧 The system is under maintenance. Please check back later.",
    });
  }

  next();
};
