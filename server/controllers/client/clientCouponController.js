import Coupon from "../../models/client/Coupon.js";
import { v4 as uuidv4 } from "uuid";

export const generateCoupon = async (req, res) => {
  try {
    const userId = req.user._id;

    // Generate unique code
    const couponCode = "CPN-" + uuidv4().slice(0, 8).toUpperCase();

    // Create coupon with all required fields
    const newCoupon = await Coupon.create({
      code: couponCode,
      type: "percentage", // required
      value: 5, // required
      maxDiscount: 80, // optional
      startDate: new Date(), // required
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // required, 24h validity
      usageLimit: 1,
      usedBy: [],
      status: "active",
      user: userId,
    });

    res.status(201).json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Coupon generation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate coupon",
    });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find({ status: "active" })
      .sort({ createdAt: -1 })
      .lean();

    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupons not found!" });

    res
      .status(200)
      .json({ success: true, message: "Coupons fetched!", data: coupon });
  } catch (error) {
    console.error("Error in fetching coupons.", error);
    res.status(500).json({ message: "Server error in fetching coupon." });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    const userId = req.user._id;

    // Fetch coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      status: "active",
    });

    if (!coupon)
      return res.status(404).json({ message: "Invalid coupon code." });

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return res
        .status(400)
        .json({ message: "Coupon is not valid at this time." });
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of $${coupon.minPurchase} required.`,
      });
    }

    if (coupon.usedBy.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You have already used this coupon." });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    } else if (coupon.type === "percentage") {
      discountAmount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscount)
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }

    // Prevent negative total
    const totalAfterDiscount = Math.max(cartTotal - discountAmount, 0);

    // Mark coupon as used
    coupon.usedBy.push(userId);
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon applied! You saved $${discountAmount.toFixed(2)}.`,
      discountAmount,
      totalAfterDiscount,
      appliedCoupon: coupon.code,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error applying coupon." });
  }
};

export default { generateCoupon, getCoupon, applyCoupon };
