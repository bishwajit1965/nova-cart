import WishList from "../../models/client/WishList.js";
import Product from "../../models/Product.js";

export const getWishList = async (req, res) => {
  try {
    const wishListData = await WishList.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!wishListData) {
      return res.status(404).json({
        success: false,
        message: "Wish list not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Wish list fetched successfully",
      data: wishListData,
    });
  } catch (error) {
    console.error("Error fetching wish list", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addToWishList = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let wishList = await WishList.findOne({ user: req.user._id });

    if (!wishList) {
      // Create new wishlist
      wishList = await WishList.create({
        user: req.user._id,
        items: [{ product: productId, variantId, quantity }],
      });
    } else {
      const alreadyExists = wishList.items.some(
        (item) =>
          item.product.equals(productId) &&
          item.variantId &&
          item.variantId.equals(variantId)
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "This variant already exists in wishlist",
        });
      }

      // Push new item
      wishList.items.push({
        product: productId,
        variantId: variantId,
        quantity,
      });
    }

    await wishList.save();
    const populatedWishList = await wishList.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Variant added to wishlist",
      data: populatedWishList,
    });
  } catch (error) {
    console.error("Error in adding to wishlist", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const removeFromWishList = async (req, res) => {
  const { productId } = req.params;
  const { variantId } = req.query; // get variantId if exists

  try {
    const wishList = await WishList.findOne({ user: req.user._id });
    if (!wishList)
      return res
        .status(404)
        .json({ success: false, message: "No wishlist found" });

    wishList.items = wishList.items.filter(
      (item) =>
        item.product.toString() !== productId ||
        (variantId && item.variantId !== variantId)
    );

    await wishList.save();
    const populatedWishList = await wishList.populate("items.product");

    res.json({ success: true, data: populatedWishList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default {
  getWishList,
  addToWishList,
  removeFromWishList,
};
