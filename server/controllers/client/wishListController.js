import WishList from "../../models/client/WishList.js";

export const getWishList = async (req, res) => {
  console.log("🚨 Wishlist controller is hit!");
  try {
    const wishListData = await WishList.findOne({
      user: req.user._id,
    }).populate("items.product");
    console.log("WishlistData fetched:", wishListData);
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
    const { productId } = req.body;

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
        items: [{ product: productId }],
      });
    } else {
      // Check duplicate
      const alreadyExists = wishList.items.some(
        (item) => item.product.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product already exists in wishlist",
        });
      }

      // Push new item
      wishList.items.push({ product: productId });
    }

    await wishList.save();
    const populatedWishList = await wishList.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
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
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const wishList = await WishList.findOne({ user: req.user._id });

    if (!wishList) {
      return res.status(404).json({
        success: false,
        message: "Wish list not found",
      });
    }

    wishList.items = wishList.items.filter(
      (item) => item.product.toString() !== productId
    );

    await wishList.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wish list successfully!",
      data: wishList,
    });
  } catch (error) {
    console.error("Error in removing from wish list", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  getWishList,
  addToWishList,
  removeFromWishList,
};
