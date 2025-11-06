// models/Content.js

import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, default: "text" }, // optional: text, textarea, image, etc.
});

const ContentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // faq, contact, about, etc.
    title: { type: String },
    description: { type: String },
    fields: [FieldSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Content", ContentSchema);
