import Product from "../../models/Product.js";
import User from "../../models/User.js";

// Save recently viewed product ids to user's collection
export const saveRecentlyViewedProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID required" });
    }
    const user = await User.findById(userId);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Remove duplicate if exists
    user.recentlyViewedProducts = user.recentlyViewedProducts.filter(
      (item) => item.productId.toString() !== productId
    );

    // Add to top
    user.recentlyViewedProducts.unshift({ productId });

    // Keep only last 20
    user.recentlyViewedProducts = user.recentlyViewedProducts.slice(0, 20);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Recently viewed product saved",
      data: user.recentlyViewedProducts,
    });
  } catch (error) {
    console.error("Save recently viewed error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Ids from localStorage then get product details from DB(products collection)
export const getRecentlyViewedProductsByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    console.log("IDS", ids);

    if (!ids) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Split and ensure all IDs are strings
    const idArray = ids
      .split(",")
      .filter(Boolean)
      .map((id) => id.toString());
    if (!idArray.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    console.log("ID ARRAYS=>", idArray);
    // Fetch products from DB
    const products = await Product.find({
      _id: { $in: idArray },
      status: "active",
    })
      .select("name price images slug variants")
      .lean();

    // Map products for fast lookup
    const productMap = Object.fromEntries(
      products.map((p) => [p._id.toString(), p])
    );

    // Preserve frontend order & map name → title
    const sortedProducts = idArray
      .map((id) => productMap[id])
      .filter(Boolean)
      .map((p) => ({ ...p, title: p.name }));

    return res.status(200).json({
      success: true,
      message: "Recently viewed products fetched",
      data: sortedProducts,
    });
  } catch (error) {
    console.error("Recently viewed error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getRecentlyViewedProductsFromDB = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("recentlyViewedProducts")
      .populate({
        path: "recentlyViewedProducts.productId",
        select: "name title price images slug description variants brand",
      });

    if (!user || !user.recentlyViewedProducts?.length) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    // Sort by most recent
    const products = user.recentlyViewedProducts
      .sort((a, b) => b.viewedAt - a.viewedAt)
      .map((item) => item.productId)
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      message: "Recently viewed products fetched from DB",
      data: products,
    });
  } catch (error) {
    console.error("Fetch recently viewed from DB error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default {
  saveRecentlyViewedProduct,
  getRecentlyViewedProductsByIds,
  getRecentlyViewedProductsFromDB,
};
