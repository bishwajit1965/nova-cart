import SubCategory from "../../models/SubCategory.js";
import slugify from "slugify";

export const createSubCategory = async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const slug = slugify(name.toLowerCase());
    const subCategory = await SubCategory.create({
      name,
      slug,
      category,
      description,
    });
    res.status(201).json({
      success: true,
      message: "Sub-category created successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error in creating sub-category!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category", "name");
    if (!subCategories)
      return res
        .status(404)
        .json({ success: false, message: "Sub categories not found." });
    res.status(200).json({
      success: true,
      message: "Sub-categories fetched successfully!",
      data: subCategories,
    });
  } catch (error) {
    console.error("Error in fetching sub-categories.", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const getSubCategoriesById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id).populate(
      "category",
      "name"
    );
    if (!subCategory)
      return res
        .status(404)
        .json({ success: false, message: "Sub-category not found!" });
    res.status(200).json({
      success: true,
      message: "Sub-category is fetched successfully!",
      data: subCategory,
    });
  } catch (error) {
    console.error("Error in fetching sub-category!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, category, description } = req.body;
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, category, description, ...(slug && { slug }) },
      { new: true }
    );
    if (!updatedSubCategory)
      return res
        .status(404)
        .json({ success: false, message: "Sub category is not updated!" });
    res.status(201).json({
      success: true,
      message: "Sub category updated successfully!",
      data: updatedSubCategory,
    });
  } catch (error) {
    console.error("Error in updating sub-category", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      message: error.message,
    });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await SubCategory.findByIdAndDelete(id);
    if (!deleteSubCategory)
      return res
        .json(404)
        .json({ success: false, message: "Sub category not found!" });
    res.status(201).json({
      success: true,
      message: "Subcategory deleted successfully!",
    });
  } catch (error) {
    console.error("Error in deleting sub category", error);
    res.status(500).json({
      success: false,
      message: " Internal server error",
      message: error.message,
    });
  }
};

export default {
  createSubCategory,
  getSubCategories,
  getSubCategoriesById,
  updateSubCategory,
  deleteSubCategory,
};
