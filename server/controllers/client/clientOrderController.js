import Address from "../../models/client/Address.js";
import Coupon from "../../models/client/Coupon.js";
import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import generateInvoice from "../../utils/invoiceGenerator.js";
import { v4 as uuidv4 } from "uuid";

import { sendOrderConfirmationEmail } from "../../utils/clientEmailService.js";

const generateCoupon = () => {
  const timestamp = Date.now().toString().slice(-5);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Randomly choose type for demo; in real use, admin defines type
  const type = Math.random() > 0.5 ? "percentage" : "flat";

  return {
    code: `CPN-${randomStr}${timestamp}`,
    discountType: type, // "percentage" or "flat"
    discountValue: type === "percentage" ? 10 : 500, // 10% or 500 currency units
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h expiry
  };
};

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, addressId, paymentMethod, couponCode } =
      req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in the order." });

    // Build order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product).select(
          "name price images variants"
        );
        if (!product) throw new Error(`Product not found: ${item.product}`);

        let unitPrice = product.price ?? 0;
        if (item.variantId && Array.isArray(product.variants)) {
          const variant = product.variants.find(
            (v) => String(v._id) === String(item.variantId)
          );
          if (variant) {
            unitPrice =
              typeof variant.discountPrice === "number"
                ? variant.discountPrice
                : variant.price ?? unitPrice;
          }
        }

        const image =
          item.selectedImage ||
          (product.images && product.images.length ? product.images[0] : null);

        return {
          product: product._id,
          name: product.name,
          price: unitPrice,
          image,
          quantity: Number(item.quantity) || 1,
          variant: item.variantId || null,
        };
      })
    );

    const subtotal = orderItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    // =============================
    // Handle coupon
    // =============================
    let coupon = null;
    let discountAmount = 0;

    if (couponCode) {
      // User-provided coupon
      const couponDoc = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        status: "active",
      });

      if (!couponDoc)
        return res.status(404).json({ message: "Invalid coupon" });

      const now = new Date();
      if (now < couponDoc.startDate || now > couponDoc.endDate)
        return res
          .status(400)
          .json({ message: "Coupon is not valid at this time." });

      // if (couponDoc.usedBy.includes(req.user._id))
      //   return res
      //     .status(400)
      //     .json( { message: "You have already used this coupon." } );
      if (
        couponDoc.usedBy.length > 0 &&
        String(couponDoc.usedBy[0]) !== String(req.user._id)
      ) {
        return res
          .status(400)
          .json({ message: "This coupon does not belong to you." });
      }

      // Calculate discount
      discountAmount =
        couponDoc.type === "percentage"
          ? (subtotal * couponDoc.value) / 100
          : couponDoc.value;

      // Apply maxDiscount if defined
      if (couponDoc.type === "percentage" && couponDoc.maxDiscount)
        discountAmount = Math.min(discountAmount, couponDoc.maxDiscount);

      // Prevent negative total
      discountAmount = Math.min(discountAmount, subtotal);

      coupon = {
        code: couponDoc.code,
        type: couponDoc.type,
        value: couponDoc.value,
        maxDiscount: couponDoc.maxDiscount,
        startDate: couponDoc.startDate,
        endDate: couponDoc.endDate,
        discountAmount,
      };

      // Mark coupon as used
      couponDoc.usedBy.push(req.user._id);
      await couponDoc.save();
    }

    const finalAmount = subtotal - discountAmount;

    // =============================
    // Handle shipping address
    // =============================
    let finalAddress;
    if (addressId) {
      const addressDoc = await Address.findOne({
        _id: addressId,
        user: req.user._id,
      });
      if (!addressDoc)
        return res.status(404).json({ message: "Address not found!" });
      finalAddress = addressDoc.toObject();
    } else if (shippingAddress) {
      const newAddress = new Address({
        user: req.user._id,
        ...shippingAddress,
      });
      const savedAddress = await newAddress.save();
      finalAddress = savedAddress.toObject();
    } else {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // =============================
    // Create order
    // =============================
    const order = new Order({
      user: req.user._id,
      orderId: uuidv4(),
      items: orderItems,
      subtotal,
      discountAmount,
      finalAmount,
      totalAmount: finalAmount,
      coupon,
      shippingAddress: {
        fullName: finalAddress.fullName,
        email: req.user.email,
        phone: finalAddress.phone,
        addressLine1: finalAddress.addressLine1,
        addressLine2: finalAddress.addressLine2,
        city: finalAddress.city,
        state: finalAddress.state,
        postalCode: finalAddress.postalCode,
        country: finalAddress.country,
        isDefault: finalAddress.isDefault || false,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "unpaid" : "paid",
      status: "pending",
      statusHistory: [{ status: "pending" }],
    });

    const savedOrder = await order.save();

    console.log("🚀 Sending email to user");

    // Send confirmation email
    await sendOrderConfirmationEmail({
      userEmail: req.user.email,
      orderId: savedOrder.orderId, // or savedOrder._id if you prefer
      items: savedOrder.items,
      totalPrice: savedOrder.totalAmount.toFixed(2), // <-- correct field
    });

    res.status(201).json({
      success: true,
      message: "Order processed successfully!",
      data: savedOrder,
    });
  } catch (error) {
    console.error("❌ Error processing order:", error);
    res.status(500).json({
      message: "Internal server error processing order.",
      error: error.message,
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

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await Order.findOne({ orderId, user: userId });
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Order can not be cancelled at this stage.",
      });
    }
    order.status = "cancelled";
    order.statusHistory.push({ status: "cancelled", date: new Date() });
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Order has been cancelled successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Error in cancelling order", error);
    res.status(500).json({
      success: false,
      message: "Internal server order",
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("➡️ User id of orders", userId);
    const user = await User.findById(userId)
      .populate({
        path: "plan",
        populate: { path: "features" }, // <-- important
      })
      .populate("roles")
      .populate("permissions")
      .lean();

    const orders = await Order.find({ user: userId })
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      success: true,
      message: "User related orders fetched successfully!",
      data: user,
      orders: orders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getClientOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrdersForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ user: userId }).populate("items.product");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  console.log("Order Id", orderId);

  try {
    const order = await Order.findOne({ orderId }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user items.product");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createOrder,
  getClientOrders,
  getOrderById,
  getOrdersForUser,
  downloadInvoice,
  cancelOrder,
  getMyOrders,
};
