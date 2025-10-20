import mongoose from "mongoose";

const HeroSlideSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["hero", "banner"],
      default: "hero",
      required: true,
    },
    title: { type: String }, // Only for hero
    subtitle: { type: String }, // Only for hero
    image: { type: String, required: true },
    ctaLink: { type: String }, // Optional primary button
    secondaryLink: { type: String }, // Optional secondary button
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const HeroSlide = mongoose.model("HeroSlide", HeroSlideSchema);

export default HeroSlide;
