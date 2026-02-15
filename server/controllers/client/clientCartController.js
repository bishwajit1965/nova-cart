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

// export const addToCart = async (req, res) => {
//   try {
//     const { productId, variantId, quantity = 1 } = req.body;
//     let { image } = req.body;
//     if (!productId || quantity <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID and positive quantity are required",
//       });
//     }

//     // Fetch product to get snapshot info
//     const product = await Product.findById(productId).select(
//       "name images variants price"
//     );
//     if (!product)
//       return res
//         .status(404)
//         .json({ success: false, message: "Product not found" });

//     let finalPrice = product.price;
//     let variantData = null;
//     let color = null;
//     let size = null;
//     let variant = null;
//     image = image || (product.images?.[0] ?? null);
//     if (variantId && product.variants?.length) {
//       const variant = product.variants.find((v) => String(v._id) === variantId);

//       if (!variant) {
//         return res.json({ success: false, message: "Wrong variant selected" });
//       }
//       if (variant) {
//         finalPrice = Number(variant.price ?? variant.price ?? product.price);
//         variantData = {
//           variantId: variant._id,
//           name: variant.name ?? product.name,
//           color: variant.color,
//           size: variant.size,
//           price: finalPrice,
//           image: variant.images ?? product.images[0],
//         };
//       }
//     }

//     console.log("Variant", variant);
//     console.log("Selected variant:", variantData);
//     console.log("Final price:", finalPrice, "Quantity:", quantity);

//     // Prepare item snapshot
//     const itemSnapshot = {
//       product: product._id,
//       name: product.name,
//       price: finalPrice,
//       quantity,
//       subtotal: finalPrice * quantity, // ✅ required field
//       image: product.images?.[0] || null,
//       ...variantData,
//     };

//     // Get user's cart or create
//     let cart = await Cart.findOne({ user: req.user._id });
//     if (!cart) {
//       cart = await Cart.create({
//         user: req.user._id,
//         items: [itemSnapshot],
//       });
//     } else {
//       // Check if same product + variant exists
//       const itemIndex = cart.items.findIndex(
//         (item) =>
//           String(item.product) === String(productId) &&
//           String(item.variantId ?? "") === String(variantId ?? "")
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity;
//       } else {
//         cart.items.push(itemSnapshot);
//       }
//       await cart.save();
//     }

//     const populatedCart = await cart.populate("items.product");
//     res.status(201).json({
//       success: true,
//       message: "Product added to cart successfully",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error adding to cart:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addToCart = async (req, res) => {
//   try {
//     const { productId, variantId, name, quantity } = req.body;
//     let { image } = req.body; // let, since we reassign below

//     if (!productId || !quantity) {
//       return res.status(400).json({
//         success: false,
//         message: "Product ID and quantity are required",
//       });
//     }

//     const product = await Product.findById(productId).select(
//       "name images variants price quantity"
//     );
//     if (!product) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Product not found" });
//     }

//     let price = product.price;
//     let color = null;
//     let size = null;

//     if (variantId) {
//       const variant = product.variants.find(
//         (v) => String(v._id) === String(variantId)
//       );
//       if (!variant) {
//         return res
//           .status(400)
//           .json({ success: false, message: " Invalid variant" });
//       }
//       price = variant.price;
//       color = variant.color;
//       size = variant.size;
//     } else {
//       price = product.price;
//     }

//     image = image || (product.images?.[0] ?? null);

//     let cart =
//       (await Cart.findOne({ user: req.user._id })) ||
//       new Cart({ user: req.user._id, items: [] });
//     if (!cart) {
//       // Create new cart
//       cart = await Cart.create({
//         user: req.user._id,
//         items: [
//           {
//             product: productId,
//             variantId: variantId || null,
//             name: name || product.name,
//             color,
//             size,
//             price,
//             quantity,
//             image,
//           },
//         ],
//       });
//     } else {
//       // Update existing cart (check if same product + same variant already exists)
//       const vId = variantId ? String(variantId) : null;

//       const itemIndex = cart.items.findIndex(
//         (item) =>
//           item.product.toString() === productId &&
//           (item.variantId ? String(item.variantId) : null) === vId
//       );

//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity += quantity; // increase quantity
//       } else {
//         cart.items.push({
//           product: productId,
//           variantId: vId || null,
//           name: product.name,
//           color,
//           size,
//           price,
//           quantity,
//           image,
//         });
//       }
//       await cart.save();
//     }
//     const populatedCart = await cart.populate("items.product");
//     res.status(201).json({
//       success: true,
//       message: "Product added to cart successfully!",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error in adding to cart", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

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

// export const updateCartItem = async (req, res) => {
//   try {
//     const { productId, variantId, quantity } = req.body;
//     if (typeof quantity !== "number") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Quantity must be a number" });
//     }

//     let cart = await Cart.findOne({ user: req.user._id });
//     if (!cart) cart = new Cart({ user: req.user._id, items: [] });

//     const itemIndex = cart.items.findIndex(
//       (item) =>
//         String(item.product) === String(productId) &&
//         String(item.variantId ?? "") === String(variantId ?? "")
//     );

//     if (itemIndex === -1) {
//       if (quantity > 0)
//         cart.items.push({ product: productId, variantId, quantity });
//     } else {
//       if (quantity <= 0) cart.items.splice(itemIndex, 1);
//       else cart.items[itemIndex].quantity = quantity;
//     }

//     await cart.save();
//     const populatedCart = await cart.populate("items.product");

//     res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updateCartItem = async (req, res) => {
//   try {
//     const { productId, variantId, quantity } = req.body;
//     const userId = req.user._id;
//     if (typeof quantity !== "number") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Quantity must be a number" });
//     }
//     // Use let to allow reassignment
//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       console.log("No cart found — creating new one");
//       cart = new Cart({ user: userId, items: [] });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) =>
//         item.product.toString() === productId &&
//         item.variantId?.toString() === variantId
//     );

//     if (itemIndex === -1) {
//       if (quantity > 0) {
//         cart.items.push({ product: productId, quantity });
//       }
//     } else {
//       if (quantity <= 0) {
//         cart.items.splice(itemIndex, 1);
//       } else {
//         cart.items[itemIndex].quantity = quantity;
//       }
//     }
//     await cart.save();
//     const populatedCart = await cart.populate("items.product");

//     res.status(200).json({
//       success: true,
//       message: "Cart updated successfully",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error updating cart", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// Remove item from cart
// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const cart = await Cart.findOne({ user: req.user._id });
//     if (!cart)
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });

//     cart.items = cart.items.filter(
//       (item) => item.product.toString() !== productId
//     );
//     await cart.save();
//     const populatedCart = await cart.populate("items.product");

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error removing item from cart", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId, variantId } = req.params; // pass variantId optionally
//     const cart = await Cart.findOne({ user: req.user._id });
//     if (!cart)
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });

//     cart.items = cart.items.filter(
//       (item) =>
//         String(item.product) !== productId ||
//         (variantId && String(item.variantId) !== variantId)
//     );

//     await cart.save();
//     const populatedCart = await cart.populate("items.product");

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error removing item from cart", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export const removeFromCart = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    const userId = req.user._id;

    if (!productId || !variantId) {
      return res.status(400).json({
        success: false,
        message: "Product ID and Variant ID are required",
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    // Filter out only the specific variant
    cart.items = cart.items.filter(
      (item) =>
        String(item.product) !== String(productId) ||
        String(item.variantId) !== String(variantId),
    );

    await cart.save();

    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart item removed successfully",
      data: populatedCart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// export const removeFromCart = async (req, res) => {
//   try {
//     const { productId, variantId } = req.params; // expect both IDs
//     const cart = await Cart.findOne({ user: req.user._id });

//     console.log("ProductId", productId, "VariantId", variantId);
//     if (!cart) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Cart not found" });
//     }

//     // Filter out only the item with matching productId AND variantId
//     cart.items = cart.items.filter(
//       (item) =>
//         String(item.product) !== String(productId) ||
//         String(item.variantId ?? "") !== String(variantId ?? "")
//     );

//     await cart.save();
//     const populatedCart = await cart.populate("items.product");

//     res.status(200).json({
//       success: true,
//       message: "Item removed from cart",
//       data: populatedCart,
//     });
//   } catch (error) {
//     console.error("Error removing item from cart", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

export default {
  addToCart,
  getCart,
  getAllCarts,
  updateCartItem,
  removeFromCart,
};
