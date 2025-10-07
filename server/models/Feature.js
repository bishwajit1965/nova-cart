import mongoose from "mongoose";

const featureSChems = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", featureSChems);
export default Feature;
