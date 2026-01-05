// controllers/admin/testimonialController.js
import Testimonial from "../../models/client/Testimonial.js";

export const getAllTestimonials = async (req, res) => {
  console.log("🎯 Get all testimonials method is hit");
  const testimonials = await Testimonial.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: "Testimonials fetched successfully!",
    data: testimonials,
  });
};

export const approveTestimonial = async (req, res) => {
  console.log("🎯 Approve testimonials method is hit");
  console.log("REQ PARAMS", req.params.id);
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial)
    return res.status(404).json({ message: "Testimonial not found" });

  testimonial.status = "approved";
  await testimonial.save();

  res.status(200).json({ message: "Testimonial approved" });
};

// PATCH /api/v1/superAdmin/testimonials/:id/status
// export const updateTestimonialStatus = async (req, res) => {
//   console.log("🎯 Update testimonials method is hit");
//   try {
//     const { status } = req.body;
//     console.log("Status=>", status);

//     const testimonial = await Testimonial.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!testimonial) {
//       return res.status(404).json({
//         status: "error",
//         message: "Testimonial not found",
//       });
//     }

//     res.status(200).json({
//       status: "success",
//       message: "Status updated successfully",
//       data: testimonial,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };

export const updateTestimonialStatus = async (req, res) => {
  console.log("🎯 Update testimonials method is hit");
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body;
    console.log("ID & status featured", id, status);

    const testimonial = await Testimonial.findById(id);
    console.log("Testimonial", testimonial);
    if (!testimonial) {
      return res.status(404).json({
        status: "error",
        message: "Testimonial not found",
      });
    }

    // Business rule: only approved can be featured
    if (isFeatured === true && status && status !== "approved") {
      return res.status(400).json({
        status: "error",
        message: "Only approved testimonials can be featured",
      });
    }

    if (status) testimonial.status = status;
    if (typeof isFeatured === "boolean") testimonial.isFeatured = isFeatured;

    await testimonial.save();

    res.status(200).json({
      status: "success",
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
      error: error.message,
    });
  }
};

export const hideTestimonial = async (req, res) => {
  console.log("🎯 Hide testimonials method is hit");
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial)
    return res.status(404).json({ message: "Testimonial not found" });

  testimonial.status = "hidden";
  testimonial.isFeatured = false;
  await testimonial.save();

  res.status(200).json({ message: "Testimonial hidden" });
};

export const toggleFeaturedTestimonial = async (req, res) => {
  console.log("🎯 Toggle Featured testimonials method is hit");
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial)
    return res.status(404).json({ message: "Testimonial not found" });

    testimonial.isFeatured = !testimonial.isFeatured;
    
  await testimonial.save();

  res.status(200).json({
    message: testimonial.isFeatured
      ? "Testimonial featured"
      : "Testimonial un-featured",
  });
};

export const deleteTestimonial = async (req, res) => {
  console.log("🎯 Delete testimonials method is hit");
  // const testimonial = await Testimonial.findById( req.params.id );
  await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial)
    return res.status(404).json({ message: "Testimonial not found" });

  await testimonial.deleteOne();
  res.status(200).json({ message: "Testimonial deleted" });
};

export default {
  getAllTestimonials,
  approveTestimonial,
  updateTestimonialStatus,
  hideTestimonial,
  toggleFeaturedTestimonial,
  deleteTestimonial,
};
