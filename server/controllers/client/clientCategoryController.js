import Category from "../../models/Category.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required." });
    const slug = slugify(name, { lower: true });
    // Check if slug already exists
    const existing = await Category.findOne({ slug });
    if (existing)
      return res.status(400).json({ message: "Category name already exists." });
    const category = new Category({
      name,
      description,
      slug,
      parent: parent || null,
    });
    await category.save();
    res.status(200).json({
      success: true,
      message: "Category is created successfully!",
      data: category,
    });
  } catch (error) {
    console.error("Category creation error!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parent: null })
      .populate("subcategories", "name slug")
      .lean();

    res.status(200).json({
      success: true,
      message: "Categories with sub categories are fetched",
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent } = req.body;
    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true });
    }
    if (description !== undefined) updateData.description = description;
    if (parent !== undefined) updateData.parent = parent;
    const updated = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Category not found!" });
    res.status(200).json({
      success: true,
      message: "Category updated successfully!",
      category: updated,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get non-featured categories (for Shop by Category section)
export const getNonFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: false })
      .select("name slug featuredImage") // only what we need
      .lean();

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Non-featured categories fetched successfully!",
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching non-featured categories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryDeleted = await Category.findByIdAndDelete(id);
    if (!categoryDeleted)
      return res
        .status(404)
        .json({ success: false, message: "Category not found." });
    res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (error) {
    console.error("Category deletion error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  createCategory,
  getCategories,
  updateCategory,
  getNonFeaturedCategories,
  deleteCategory,
};
