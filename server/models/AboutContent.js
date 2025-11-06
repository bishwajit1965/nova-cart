import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      enum: ["hero", "founder", "mission", "experience", "skills", "cta"],
      unique: true,
    },
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String, // supports HTML or rich text
    },
    image: {
      type: String, // optional image URL
    },
    extraData: {
      type: Object, // flexible — can store skill arrays, stats, etc.
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("AboutContent", aboutContentSchema);
