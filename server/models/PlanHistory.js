//server/models/PlanHistory.js

import mongoose from "mongoose";

const planHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    action: {
      type: String,
      enum: ["subscribe", "upgrade", "downgrade", "cancel"],
      required: true,
    },
    price: { type: Number, required: true },
    features: [{ type: String }],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    stripeSessionId: { type: String },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PlanHistory = mongoose.model("PlanHistory", planHistorySchema);

export default PlanHistory;
