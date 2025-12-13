import Faq from "../../models/Faq.js";

// ✅ Create FAQ
export const createFaq = async (req, res) => {
  try {
    const faq = new Faq({ ...req.body, createdBy: req.user?._id });
    await faq.save();
    res
      .status(201)
      .json({ success: true, message: "FAQ created successfully", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// GET single content
export const getFaq = async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);
    if (!faq) return res.status(404).json({ error: "Faq not found." });
    res
      .status(200)
      .json({ success: true, message: "Faq fetched successfully!", data: faq });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content." });
  }
};

// ✅ Get All FAQs
export const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json({ success: true, data: faqs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, message: "FAQ updated successfully", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    await Faq.findByIdAndDelete(id);
    res.json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createFaq,
  getFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};
