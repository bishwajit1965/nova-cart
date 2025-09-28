import AuditLog from "../models/AuditLog.js";

export const logAction = async ({
  userId,
  action,
  entity,
  entityId,
  description,
  ipAddress,
}) => {
  try {
    await AuditLog.create({
      user: userId,
      action,
      entity,
      entityId,
      description,
      ipAddress,
    });
  } catch (err) {
    console.error("Audit Log Error:", err.message);
  }
};

export default { logAction };
