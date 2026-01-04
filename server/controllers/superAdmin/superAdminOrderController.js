import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import generateInvoiceFile from "../../utils/generateInvoiceFile.js";
import generateInvoice from "../../utils/invoiceGenerator.js";
import sendEmailWithAttachment from "../../utils/sendEmailWithAttachment.js";

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
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // typo fixed: should be createdAt

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
    const userId = req.user._id; // From auth middleware
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔏 Ownership check
    if (
      order.user.toString() !== userId.toString &&
      order.user.role !== "super-admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied!" });
    }

    generateInvoice(order, res); // pass order to PDF generator
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const foundOrder = await Order.findOne({ orderId }).populate(
      "user",
      "name email"
    );

    // ✅ Find order by custom orderId, not _id
    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true, runValidators: false }
    ).populate("user", "email name"); // ensures we get user email

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // ✅ Send response immediately (avoid double headers)
    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });

    // ✅ Background email sending (after response)
    if (status === "delivered" && order.user?.email) {
      try {
        const invoicePath = await generateInvoiceFile(order); // PDF file created

        await sendEmailWithAttachment({
          to: order.user.email,
          subject: `Your Nova-Cart Order ${order.orderId} Invoice`,
          text: `Hello ${
            order.user.name || "Valued Customer"
          },\n\nYour order has been delivered successfully! Please find your invoice attached.\n\nThank you for shopping with Nova-Cart!`,
          // attachmentPath: invoicePath,
          attachments: [
            {
              filename: invoicePath.split("/").pop(),
              path: invoicePath,
              contentType: "application/pdf",
            },
          ],
        });
      } catch (emailErr) {
        console.error("❌ Email sending failed:", emailErr);
      }
    } else if (!order.user?.email) {
      console.warn("⚠️ No email found for this user. Skipping notification.");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
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
