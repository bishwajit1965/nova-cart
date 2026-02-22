import Category from "../../models/Category.js";
import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import SubCategory from "../../models/SubCategory.js";
import Cart from "../../models/Cart.js";

export const getProducts = async (req, res) => {
  try {
    const {
      category: categorySlug,
      subCategory: subCategorySlug,
      minPrice,
      maxPrice,
      brand,
    } = req.query;

    let filter = { status: "active" };

    // Category filter
    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      } else {
        // Invalid slug → return empty
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // ✅ SubCategory filter
    if (subCategorySlug) {
      const subCategory = await SubCategory.findOne({ slug: subCategorySlug });
      if (subCategory) {
        filter.subCategory = subCategory._id;
      } else {
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Brand filter
    if (brand && brand !== "All Brands") {
      filter.brand = brand;
    }

    // Fetch products with category populated
    const products = await Product.find(filter)
      .populate("category", "slug name")
      .populate("subCategory", "slug name");

    // console.log("Filtered Products", products);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product", // ← use items.product
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },

      // ✅ STATUS FILTER GOES HERE
      { $match: { "product.status": "active" } },

      // ✅ LIMIT LAST
      { $limit: limit },

      {
        $project: {
          _id: 0,
          productId: "$product._id",
          name: "$product.name",
          description: "$product.description",
          price: "$product.price",
          images: { $ifNull: ["$product.images", []] }, // ensure always array,
          totalSold: 1,
        },
      },
    ]);

    if (!bestSellers)
      return res
        .status(404)
        .json({ success: false, message: "Best sellers not found" });
    res.status(200).json({
      success: true,
      message: "Best sellers fetched successfully!",
      data: bestSellers,
    });
  } catch (error) {
    console.error("Error in fetching best sellers", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .populate("category", "slug name")
      .populate("subCategory", "slug name");
    if (!products)
      return res
        .status(404)
        .json({ success: false, message: "Products not found" });
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: products,
    });
  } catch (error) {
    console.error("Error in fetching products", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getRandomProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const products = await Product.aggregate([
      { $match: { status: "active" } },
      { $sample: { size: limit } },
    ]);
    if (!products)
      return res
        .status(404)
        .json({ success: false, message: "Random products not found!" });
    res.status(200).json({
      success: true,
      message: "Random 8 products fetched!",
      data: products,
    });
  } catch (error) {
    console.error("Error in fetching random products!", error);
    res.status(500).json({
      success: false,
      message: "Internal server error! ",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById({ _id: id, status: "active" });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({
      success: true,
      message: "Product fetched successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Error in fetching product", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    // Remove product from all carts
    await Cart.updateMany(
      { "items.product": id },
      { $pull: { items: { product: id } } },
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  getProducts,
  getRandomProducts,
  getBestSellers,
  getAllProducts,
  getProductById,
};
