/**=================================================
 * THIS ORDER MODEL IS COMMONLY USED BY CLIENT AND
 * SUPER-ADMIN & IF NEEDED ADMIN WILL ALSO USE IT
 * NOTED ON -> 23.08.2025
 * =================================================*/

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  // orderId: { type: String, unique: true }, // <--- add this
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  quantity: {
    type: Number,
    required: true,
  },
});

// Sub document
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true, // ✅ Only at top level
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    totalAmount: {
      type: Number,
      required: true,
    },
    coupon: {
      code: { type: String, required: false },
      discountType: {
        type: String,
        enum: ["percentage", "flat"],
        required: false,
      },
      discountValue: { type: Number, required: false },
      expiresAt: { type: Date, required: false },
      discountAmount: { type: Number, required: false }, // calculated
    },
    // 🏠 Shipping Address
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      isDefault: { type: Boolean, default: false },
    },

    // 💳 Payment
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "Bkash", "Nagad"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },
    // 🚚 Order Status Timeline
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: { type: String },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
