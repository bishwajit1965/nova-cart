import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, quantity = 1 } = req.body;

    if (!productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product ID and positive quantity are required",
      });
    }

    const product = await Product.findById(productId).select(
      "name images variants price",
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let variant = null;
    let finalPrice = product.price;

    if (variantId && product.variants?.length) {
      variant = product.variants.find(
        (v) => String(v._id) === String(variantId),
      );

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: "Wrong variant selected",
        });
      }

      finalPrice = Number(variant.price);
    }

    const resolvedImage = variant?.images?.[0] ?? product.images?.[0] ?? null;

    const itemSnapshot = {
      product: product._id,
      variantId: variant?._id,
      name: product.name,
      brand: product.brand,
      color: variant?.color,
      size: variant?.size,
      price: finalPrice,
      quantity,
      subtotal: finalPrice * quantity,
      image: resolvedImage,
      SKU: variant?.SKU ?? product.SKU ?? "N/A", // ✅ fallback to "N/A" if missing
    };

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [itemSnapshot],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          String(item.product) === String(productId) &&
          String(item.variantId ?? "") === String(variantId ?? ""),
      );

      if (itemIndex > -1) {
        const item = cart.items[itemIndex];
        item.quantity += quantity;
        item.subtotal = item.quantity * item.price;
      } else {
        cart.items.push(itemSnapshot);
      }

      await cart.save();
    }

    const populatedCart = await cart.populate("items.product");

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCarts = async (req, res) => {
  try {
    const cartsData = await Cart.find({}).populate({
      path: "items.product",
      select: "name brand price images category",
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
      select: "name brand price quantity SKU images category variants",
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
    const { productId, variantId, quantity } = req.body;
    const userId = req.user._id;

    if (typeof quantity !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be a number" });
    }

    let cart = await Cart.findOne({ user: userId });

    // Fetch product info for price / variant snapshot
    const product = await Product.findById(productId).select(
      "name price variants images SKU",
    );
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let variant = null;
    let finalPrice = product.price;
    let resolvedImage = product.images?.[0] ?? null;
    let SKU = product.SKU ?? null;

    if (variantId && product.variants?.length) {
      variant = product.variants.find((v) => String(v._id) === variantId);
      if (!variant) {
        return res
          .status(400)
          .json({ success: false, message: "Wrong variant selected" });
      }
      finalPrice = variant.price ?? product.price;
      resolvedImage = variant.images?.[0] ?? resolvedImage;
      SKU = variant.SKU ?? SKU;
    }

    if (!cart) {
      // Create new cart
      if (quantity <= 0) {
        return res
          .status(400)
          .json({ success: false, message: "Quantity must be positive" });
      }
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: product._id,
            variantId: variant?._id,
            name: product.name,
            color: variant?.color,
            size: variant?.size,
            price: finalPrice,
            quantity,
            subtotal: finalPrice * quantity,
            image: resolvedImage,
            SKU,
          },
        ],
      });
    } else {
      // Find item index
      const itemIndex = cart.items.findIndex(
        (item) =>
          String(item.product) === String(productId) &&
          String(item.variantId ?? "") === String(variantId ?? ""),
      );

      if (itemIndex === -1) {
        // New item
        if (quantity > 0) {
          cart.items.push({
            product: product._id,
            variantId: variant?._id,
            name: product.name,
            color: variant?.color,
            size: variant?.size,
            price: finalPrice,
            quantity,
            subtotal: finalPrice * quantity,
            image: resolvedImage,
            SKU,
          });
        }
      } else {
        // Existing item
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1); // remove
        } else {
          cart.items[itemIndex] = {
            ...cart.items[itemIndex]._doc,
            quantity,
            price: finalPrice,
            subtotal: quantity * finalPrice,
            image: resolvedImage,
            SKU,
            color: variant?.color,
            size: variant?.size,
          };
        }
      }
      await cart.save();
    }

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

export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const userId = req.user._id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter((item) => {
      const sameProduct = String(item.product) === String(productId);

      const sameVariant =
        String(item.variantId || "") === String(variantId || "");

      // remove ONLY exact match
      return !(sameProduct && sameVariant);
    });

    await cart.save();

    const populatedCart = await cart.populate("items.product");

    return res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Remove cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
