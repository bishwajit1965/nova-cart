import Newsletter from "../../models/client/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body; // Get email from request body

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    // Check if the email already exists
    const existingSubscription = await Newsletter.findOne({ email });

    if (existingSubscription) {
      return res
        .status(400)
        .json({ success: false, message: "This Email is already subscribed!" });
    }

    // Create a new subscription
    const newSubscription = await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Subscribed to newsletter successfully!",
      data: newSubscription,
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export default { subscribeNewsletter };
