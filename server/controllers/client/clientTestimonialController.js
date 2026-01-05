import Testimonial from "../../models/client/Testimonial.js";

// @desc    Create a new testimonial
// @route   POST /api/v1/testimonials
// @access  Public
export const createTestimonial = async (req, res) => {
  try {
    const { name, email, feedback, avatar, rating } = req.body;
    const newTestimonial = new Testimonial({
      name,
      email,
      feedback,
      avatar,
      rating,
      status: "pending",
    });
    const savedTestimonial = await newTestimonial.save();
    res.status(201).json({
      status: "success",
      message: "Testimonial created successfully",
      data: savedTestimonial,
    });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get all testimonials
// @route   GET /api/v1/testimonials
// @access  Public
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: "success",
      results: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export default { createTestimonial, getAllTestimonials };
