import User from "../../models/User.js";
import Product from "../../models/Product.js";

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
    7;
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
      // message: "Recently viewed product saved12345",
      data: user.recentlyViewedProducts,
    });
  } catch (error) {
    console.error("Save recently viewed error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export default { saveRecentlyViewedProduct };
