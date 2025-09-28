import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import generateInvoice from "../../utils/invoiceGenerator.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order." });
    }
    // Fetch product details for each item and build snapshot
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        return {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image, // assuming you have product.image
          quantity: item.quantity,
        };
      })
    );

    // Calculate total
    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create order
    const order = new Order({
      user: req.user._id, // 👈 requires auth middleware
      orderId: uuidv4(),
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "unpaid" : "paid", // will later hook with real gateway
      status: "pending",
      statusHistory: [{ status: "pending" }],
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order processed successfully!",
      data: savedOrder,
    });
  } catch (error) {
    console.error("❌ Error processing order:", error.message);
    res.status(500).json({
      message: "Internal server error processing order.",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const order = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });

    const total = await Order.countDocuments(filter);
    res.status(200).json({
      success: true,
      message: "Filtered orders are fetched.",
      data: order,
      total,
    });
  } catch (error) {
    console.error("Error in fetching order.", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const orderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById({ orderId })
      .populate("user", "name email")
      .populate("items.product", "name image price");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order details not found" });
    res.status(200).json({
      success: true,
      message: "Order details fetched successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Error in fetching order details.", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    generateInvoice(order, res); // pass order to PDF generator
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOne({ orderId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });

    order.status = status;
    order.statusHistory.push({ status, date: new Date() });
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order status is updated", data: order });
  } catch (error) {
    console.error("Error in updating order status", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });

    // Only cancel if not already delivered/cancelled
    if (["delivered", "cancelled"].includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Cannot cancel order in status "${order.status}"` });
    }

    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", date: new Date() });
    await order.save();
    res
      .status(200)
      .json({ success: true, message: "Order is cancelled successfully!" });
  } catch (error) {
    console.error("Error in cancelling order", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export default {
  createOrder,
  getAllOrders,
  orderDetails,
  downloadInvoice,
  updateOrderStatus,
  cancelOrder,
};
