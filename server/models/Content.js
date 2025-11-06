// server/models/ContentItem.js

import mongoose from "mongoose";

const ContentItemSchema = new mongoose.Schema(
  {
    pageType: {
      type: String,
      required: true,
      enum: [
        "FAQ",
        "Contact",
        "About",
        "Terms",
        "Privacy",
        "HeroBanner",
        "Other",
      ],
    },
    title: { type: String }, // optional, e.g., FAQ question or section title
    description: { type: String }, // main content
    extraFields: [
      {
        key: String, // field identifier, e.g., "answer", "subtitle"
        value: String, // content value
      },
    ],
    isActive: { type: Boolean, default: true },
    ctaLink: { type: String }, // optional call-to-action link
    ctaLabel: { type: String }, // optional label
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("ContentItem", ContentItemSchema);
