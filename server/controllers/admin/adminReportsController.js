import Order from "../../models/client/Order.js";
import PDFDocument from "pdfkit"; // for PDF
import { buildOrderFilters } from "../../utils/buildOrderFilters.js";
import fs from "fs";
import path from "path";

/**
 * Get Top Products (Most Ordered)
 */
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" }, // items = [{ product, quantity, price }]
      {
        $group: {
          _id: "$items.product",
          totalOrdered: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          name: "$productDetails.name",
          totalOrdered: 1,
          totalRevenue: 1,
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      message: "Top products fetched successfully",
      data: topProducts || [],
    });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Get Recent Orders
 */
export const getRecentOrders = async (req, res) => {
  try {
    const { status, startDate, endDate, paymentMethod } = req.query;

    let filter = {};

    if (status) filter.status = status; // pending, processing, completed, cancelled
    if (paymentMethod) filter.paymentMethod = paymentMethod; // Bkash, Card, etc.
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const recentOrders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      data: recentOrders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getRevenueOverTime = async (req, res) => {
  try {
    const revenueOverTime = await Order.aggregate([
      { $match: { status: { $in: ["processing", "completed", "delivered"] } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    // Format for frontend chart
    const formatted = revenueOverTime.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(
        2,
        "0"
      )}-${String(item._id.day).padStart(2, "0")}`,
      totalRevenue: item.totalRevenue,
      totalOrders: item.totalOrders,
    }));

    res.status(200).json({
      success: true,
      message: "Revenue over time fetched successfully!",
      data: formatted || [],
    });
  } catch (error) {
    console.error("Error fetching revenue over time:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// 📌 Export as CSV (manual build)
export const exportOrdersCSV = async (req, res) => {
  try {
    const filters = buildOrderFilters(req.query);
    const orders = await Order.find(filters).lean();

    // define columns
    const headers = ["Order ID", "Status", "Payment Method", "Total Amount"];
    const rows = orders.map((order) => [
      order.orderId,
      order.status,
      order.paymentMethod,
      order.totalAmount,
    ]);

    // build CSV string
    let csv = headers.join(",") + "\n";
    rows.forEach((row) => {
      csv += row.join(",") + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment("orders-report.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "CSV export failed", error: err.message });
  }
};

// 📌 Export as PDF
export const exportOrdersPDF = async (req, res) => {
  try {
    const filters = buildOrderFilters(req.query);
    const orders = await Order.find(filters).lean();

    // Set headers first
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orders-report.pdf`
    );

    const doc = new PDFDocument({ margin: 50, size: "A4" });

    // Pipe PDF to response
    doc.pipe(res);

    // Logo (assuming you have logo.png in 'public' folder)
    const logoPath = path.join(process.cwd(), "public", "webDevProF.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 50, 20, { width: 100 }); // centered
      doc.moveDown(5);
    } else {
      doc.moveDown(5); // space if no logo
    }

    // Header
    doc.font("Times-Bold").fontSize(20).text("Nova Cart", { align: "center" });
    doc.fontSize(16).text("Orders Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
    doc.moveDown(0.5);

    // Horizontal line
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown();

    // Orders table
    orders.forEach((order, i) => {
      doc
        .font("Times-Roman")
        .fontSize(12)
        .text(
          `${i + 1}. Order ID: ${order.orderId} | Status: ${
            order.status
          } | Payment: ${
            order.paymentMethod
          } | Amount: $${order.totalAmount.toFixed(2)} | Date: ${new Date(
            order.createdAt
          ).toLocaleDateString()}`
        );
      doc.moveDown(0.5);
    });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text("© 2025 Nova cart. All rights reserved.", {
      align: "center",
    });

    // End PDF (do NOT call res.send or res.json after this!)
    doc.end();
  } catch (err) {
    console.error("PDF export failed:", err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "PDF export failed", error: err.message });
    }
  }
};

export default {
  getTopProducts,
  getRecentOrders,
  getRevenueOverTime,
  exportOrdersCSV,
  exportOrdersPDF,
};
