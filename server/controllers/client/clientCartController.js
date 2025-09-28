import Cart from "../../models/Cart.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Update existing cart
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // increase quantity
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    const populatedCart = await cart.populate("items.product");
    res.status(201).json({
      success: true,
      message: "Product added to cart successfully!",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Error in adding to cart", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getAllCarts = async (req, res) => {
  try {
    const cartsData = await Cart.find({}).populate({
      path: "items.product",
      select: "name price image category",
      match: { _id: { $ne: null } }, // skip missing products
    });

    if (!cartsData || cartsData.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Carts not found" });

    // Remove items with null products
    const cleanedCarts = cartsData.map((cart) => ({
      ...cart.toObject(),
      items: cart.items.filter((item) => item.product),
    }));

    res.status(200).json({
      success: true,
      message: "Carts fetched successfully!",
      data: cleanedCarts,
    });
  } catch (error) {
    console.error("Error in fetching carts", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "name price image category",
      match: { _id: { $ne: null } },
    });

    if (!cart) {
      // No cart found, create an empty cart
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Now safe to filter items
    cart.items = cart.items.filter((item) => item.product);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching cart", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (typeof quantity !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be a number" });
    }

    // Use let to allow reassignment
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log("No cart found — creating new one");
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      if (quantity > 0) {
        cart.items.push({ product: productId, quantity });
      }
    } else {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Error updating cart", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Error removing item from cart", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default {
  addToCart,
  getCart,
  getAllCarts,
  updateCartItem,
  removeFromCart,
};
