import HeroSlide from "../../models/HeroSlide.js";
import fs from "fs";
import path from "path";

export const getAllHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHeroSlide = async (req, res) => {
  try {
    console.log("🎯🎯Create hero slide method is hit");
    const { type, title, subtitle, ctaLink, secondaryLink } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image)
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });

    const slide = await HeroSlide.create({
      title,
      subtitle,
      image,
      ctaLink,
      ctaLabel,
      secondaryLink,
      hoverText,
      type,
    });
    res.status(201).json({ success: true, data: slide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide)
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });

    const {
      type,
      title,
      subtitle,
      ctaLink,
      ctaLabel,
      secondaryLink,
      hoverText,
    } = req.body;

    // Delete old image if a new one is uploaded
    if (req.file && slide.image) {
      const oldImagePath = path.join("uploads/hero-slides", slide.image);
      fs.existsSync(oldImagePath) && fs.unlinkSync(oldImagePath);
      slide.image = req.file.filename;
    }

    slide.title = title || slide.title;
    slide.subtitle = subtitle || slide.subtitle;
    slide.ctaLink = ctaLink || slide.ctaLink;
    slide.ctaLabel = ctaLabel || slide.ctaLabel;
    slide.secondaryLink = secondaryLink || slide.secondaryLink;
    slide.hoverText = hoverText || slide.hoverText;
    slide.type = type || slide.type;

    await slide.save();

    res.status(200).json({
      success: true,
      message: "Hero slider data updated successfully!",
      data: slide,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide)
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });

    // Delete image file
    if (slide.image) {
      const imagePath = path.join("uploads/hero-slides", slide.image);
      fs.existsSync(imagePath) && fs.unlinkSync(imagePath);
    }

    await slide.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Slide deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getAllHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
