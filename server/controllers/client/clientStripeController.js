import Order from "../../models/client/Order.js"; // your Order model
import { STRIPE } from "../../utils/constants.js";
import Stripe from "stripe";

// console.log("STRIPE", STRIPE);

const stripe = new Stripe(STRIPE?.SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  // console.log("🎯 Create Payment Intent is hit");
  const { orderId } = req.params;
  const { amount, currency = "usd" } = req.body;
  if (!orderId || !amount)
    return res.status(400).json({ message: "Order ID and amount required" });

  try {
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100),
    //   currency,
    //   metadata: { orderId },
    // });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // always in cents
      currency,
      metadata: { orderId },
      automatic_payment_methods: { enabled: true }, // easier for cards
    });
    res.status(200).json({
      success: true,
      message: "Stripe payment is successful!",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe PaymentIntent creation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

// Capture Stripe payment after client confirmation (optional)
export const capturePayment = async (req, res) => {
  console.log("🎯 REQ>BODY", req.body);
  // const { paymentIntentId, orderId } = req.body;
  console.log("🎯 Capture Payment method is hit");
  console.log("🎯 REQ>BODY", req.body); // Should show { orderId, paymentIntentId }
  if (!req.body || !req.body.orderId || !req.body.paymentIntentId) {
    return res
      .status(400)
      .json({ message: "Missing orderId or paymentIntentId" });
  }
  const { paymentIntentId, orderId } = req.body;

  console.log("🎯 Capture Payment method is hit");
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Optionally: mark order as paid in DB
      await Order.findByIdAndUpdate(
        orderId,
        {
          paymentStatus: "paid",
          status: "confirmed",
          stripePaymentIntentId: paymentIntent.id,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Order paid successfully!",
        paymentIntent,
      });
      console.log("🎯 ✅Payment is successful!!!!!!!!");
    } else {
      res.status(400).json({ message: "Payment not completed yet" });
    }
  } catch (err) {
    console.error("Stripe capture failed:", err);
    res.status(500).json({ success: false, message: "Stripe capture failed" });
  }
};

export default { createPaymentIntent, capturePayment };
