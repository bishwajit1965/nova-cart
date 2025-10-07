import mongoose from "mongoose";

const planSChema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    duration: {
      type: String,
      enum: ["monthly", "yearly", "lifetime"],
      default: "monthly",
    },
    features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }],
    description: {
      type: String,
      default: "",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Plan = mongoose.model("Plan", planSChema);
export default Plan;
