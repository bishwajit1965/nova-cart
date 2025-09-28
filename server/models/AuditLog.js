import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., "CREATE_PRODUCT"
    entity: { type: String }, // e.g., "Product", "Order"
    entityId: { type: mongoose.Schema.Types.ObjectId }, //Optional reference
    description: { type: String }, //Optional, extra info
    ipAddress: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AuditLog", auditLogSchema);
