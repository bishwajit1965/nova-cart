import Category from "../../models/Category.js";
import Order from "../../models/client/Order.js";
import Product from "../../models/Product.js";
import SubCategory from "../../models/SubCategory.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Error in creating product", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    // console.log("➡️ Get products method is hit");
    const {
      category: categorySlug,
      subCategory: subCategorySlug,
      minPrice,
      maxPrice,
      brand,
    } = req.query;

    let filter = {};

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
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
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
    const products = await Product.find({})
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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
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

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(201).json({
      success: true,
      message: "Product updated successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Error in updating product", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const deleteProduct = async (req, rs) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct)
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    res
      .status(201)
      .json({ success: true, message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error in deleting product", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const seedProducts = async (req, res) => {
  try {
    const products = [
      {
        name: "Classic Tee",
        description: "Comfortable cotton t-shirt for everyday wear",
        price: 29.99,
        stock: 50,
        image: "https://example.com/images/classic-tee.jpg",
        createdBy: mongoose.Types.ObjectId(), // or your admin user ID
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes for daily workouts",
        price: 79.99,
        stock: 30,
        image: "https://example.com/images/running-shoes.jpg",
        createdBy: mongoose.Types.ObjectId(),
      },
      {
        name: "Leather Jacket",
        description: "Stylish genuine leather jacket",
        price: 199.99,
        stock: 15,
        image: "https://example.com/images/leather-jacket.jpg",
        createdBy: mongoose.Types.ObjectId(),
      },
    ];
    let createdCount = 0;

    for (const prod of products) {
      const exists = await Product.findOne({ name: "Classic Tree" });
      if (!exists) {
        await Product.create(prod);
        createdCount++;
      }
    }

    res.json({
      message: `Seeder completed. ${createdCount} new products added.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default {
  createProduct,
  getProducts,
  getBestSellers,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
};
