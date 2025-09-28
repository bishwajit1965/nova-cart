import Order from "../../models/client/Order.js";

// Fetch all orders for admin (with optional filtering by status)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully!",
      data: orders,
      total,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
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

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order status
export const getOrderStatus = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Today's new order
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: today },
    });

    res.status(200).json({
      success: true,
      message: "Orders with status fetched successfully!",
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        ordersToday,
      },
    });
  } catch (error) {
    console.error("Error in fetching order status!", error);
    res.status().json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

// Get revenue summary
export const getRevenueSummary = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $in: ["processing", "completed", "delivered"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      message: "Total revenue fetched successfully!",
      data: {
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error in fetching revenue summary!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};
// Optional: fetch single order details
export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId })
      .populate("user", "name email")
      .populate("items.product", "name image price");

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found!" });

    res.status(200).json({
      success: true,
      message: "Order details fetched",
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Orders over time
// Get orders over time (daily for last 30 days)
export const getOrdersOverTime = async (req, res) => {
  try {
    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);

    const ordersOverTimeAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: past30Days } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format result to make it frontend-friendly
    const formatted = ordersOverTimeAgg.map((item) => {
      const { year, month, day } = item._id;
      return {
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
          2,
          "0"
        )}`,
        totalOrders: item.totalOrders,
      };
    });

    res.status(200).json({
      success: true,
      message: "Orders over time fetched successfully!",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching orders over time:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  getAllOrders,
  updateOrderStatus,
  getOrderStatus,
  getRevenueSummary,
  getOrderDetails,
  getOrdersOverTime,
};
