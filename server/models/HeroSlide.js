import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    title: { type: String }, // Only for hero
    subtitle: { type: String }, // Only for hero
    image: { type: String, required: true },
    ctaLink: { type: String, default: "/" },
    ctaLabel: { type: String, default: "Explore Now" },
    secondaryLink: { type: String },
    hoverText: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ["hero", "banner"],
      default: "hero",
      required: true,
    },
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model("HeroSlide", HeroSlideSchema);

export default HeroSlide;
