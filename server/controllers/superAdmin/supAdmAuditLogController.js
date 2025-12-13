import AuditLog from "../../models/AuditLog.js";
import Product from "../../models/Product.js";
import { logAction } from "../../utils/logAction.js";

// Optional: createAuditLog can be used internally whenever an action occurs
export const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  description,
}) => {
  try {
    const log = new AuditLog({
      user: userId,
      action,
      entity,
      entityId,
      description,
    });
    await log.save();
    return log;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    return null;
  }
};

// GET /audit-logs
export const getAuditLogs = async (req, res) => {
  try {
    const { user, entity, action, startDate, endDate } = req.query;
    const filter = {};

    if (user) filter.user = user;
    if (entity) filter.entity = entity;
    if (action) filter.action = action;
    if (startDate || endDate) filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);

    const logs = await AuditLog.find(filter)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .limit(100); // optional: pagination

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /audit-logs/:id
export const getAuditLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate(
      "user",
      "name email role"
    );
    if (!log)
      return res.status(404).json({ success: false, message: "Log not found" });
    res.json({ success: true, data: log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // --- existing update logic ---
    product.name = req.body.name ?? product.name;
    // ...other fields
    await product.save();

    // --- audit log ---
    await logAction({
      userId: req.user._id,
      action: "UPDATE_PRODUCT",
      entity: "Product",
      entityId: product._id,
      description: `Updated product ${product.name}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default { createAuditLog, getAuditLogs, getAuditLogById, updateProduct };
