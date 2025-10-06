import { PAYPAL } from "../../utils/constants.js";
import paypal from "@paypal/checkout-server-sdk";

// PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  PAYPAL.PAYPAL_CLIENT_ID,
  PAYPAL.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Create order
export const createOrder = async (req, res) => {
  const { cartItems, total } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: { currency_code: "USD", value: total.toFixed(2) },
      },
    ],
  });

  try {
    const order = await client.execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal order creation failed" });
  }
};

// Capture order
export const captureOrder = async (req, res) => {
  const { orderID } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    // Optionally save the order in DB here
    res.status(200).json(capture.result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "PayPal capture failed" });
  }
};

export default { createOrder, captureOrder };
