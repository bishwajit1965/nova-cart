import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import Role from "../../models/Role.js";
import User from "../../models/User.js";

export const getOrdersSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build filter object
    const filter = {};
    if (startDate || endDate) filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);

    // Total orders
    const totalOrders = await Order.countDocuments(filter);

    // Total sales
    const totalSalesAgg = await Order.aggregate([
      { $match: filter },
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    // Orders by status
    const statusCountsAgg = await Order.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersByStatus = statusCountsAgg.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({
      success: true,
      message: "Orders data fetched successfully!",
      data: { totalOrders, totalSales, ordersByStatus },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/superAdmin/reports/users-summary
export const getUsersSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    // Fetch users grouped by role
    const users = await User.find().populate("roles", "name"); // populate only role name

    const usersByRole = {};

    users.forEach((user) => {
      user.roles.forEach((role) => {
        if (usersByRole[role.name]) {
          usersByRole[role.name] += 1;
        } else {
          usersByRole[role.name] = 1;
        }
      });
    });

    res.json({
      success: true,
      message: "Users summary fetched successfully!",
      data: { totalUsers, usersByRole },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/superAdmin/reports/products-summary
export const getProductsSummary = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Fetch all products with populated category name
    const products = await Product.find().populate("category", "name");

    const productsByCategory = {};
    const lowStockProducts = [];

    products.forEach((p) => {
      const categoryName = p.category?.name || "Uncategorized";

      // Count per category
      if (productsByCategory[categoryName]) {
        productsByCategory[categoryName] += 1;
      } else {
        productsByCategory[categoryName] = 1;
      }

      // Collect low stock products
      if (p.stock <= 5) {
        lowStockProducts.push({
          _id: p._id,
          name: p.name,
          stock: p.stock,
        });
      }
    });

    res.json({
      success: true,
      message: "Products summary fetched successfully!",
      data: { totalProducts, productsByCategory, lowStockProducts },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// controllers/reportsController.js
export const getOrdersOverTime = async (req, res) => {
  try {
    const ordersOverTime = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalOrders: { $sum: 1 },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } }, // chronological order
    ]);

    res.json({
      success: true,
      message: "Orders over time fetched successfully!",
      data: ordersOverTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default {
  getOrdersSummary,
  getUsersSummary,
  getProductsSummary,
  getOrdersOverTime,
};
