import SystemSettings from "../../models/SystemPreferenceSettings.js";

export const getSystemPreferences = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne({});
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    res.status(200).json({
      success: true,
      message: "Settings created successfully!",
      data: settings,
    });
  } catch (error) {
    console.error("Error in fetching system preferences!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export default {
  getSystemPreferences,
};
