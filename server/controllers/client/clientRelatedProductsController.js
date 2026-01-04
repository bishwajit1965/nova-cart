import mongoose from "mongoose";
import Product from "../../models/Product.js";

export const getRelatedProducts = async (req, res) => {
  try {
    const { categoryId, exclude, limit = 6 } = req.query;

    const query = { category: categoryId };

    if (exclude) query._id = { $ne: exclude };

    const products = await Product.find(query).limit(limit).exec();

    res.json({
      success: true,
      message: "Related products data fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error in fetching related products", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    // TODO: real logic later
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    return res.status(200).json({
      success: true,
      message: "Related products fetched successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Error in fetching related product", error);
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export default { getRelatedProducts, getProductById };
