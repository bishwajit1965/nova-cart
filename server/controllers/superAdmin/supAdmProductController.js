import Category from "../../models/Category.js";
import Product from "../../models/Product.js";
import SubCategory from "../../models/SubCategory.js";
import fs from "fs";
import { logAction } from "../../utils/logAction.js";
import { nanoid } from "nanoid";
import path from "path";
import slugify from "slugify";

/** ------->helper: regenerate tags & Update Products -------> */
const generateTags = ({ name, brand, categoryName, subCategoryName }) => {
  let tags = [];

  if (name) tags.push(...name.split(" "));
  if (brand) tags.push(...brand.split(" "));
  if (categoryName) tags.push(...categoryName.split(" "));
  if (subCategoryName) tags.push(...subCategoryName.split(" "));

  // lowercase + unique
  return [...new Set(tags.map((t) => t.toLowerCase().trim()))];
};

// Generate slug from name to create product
async function generateUniqueSlug(name) {
  let baseSlug = slugify(name.toLowerCase());
  let slug = baseSlug;
  let counter = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
}

/** -------> Create Product -------> */
export const createProduct = async (req, res) => {
  try {
    // 1️⃣ Parse JSON payload
    const bodyData = JSON.parse(req.body.data);
    const {
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      stock,
      brand,
      tags,
    } = bodyData;

    console.log("Body data:", bodyData);

    // 2️⃣ Validate category exists
    const cat = await Category.findById(category);
    if (!cat)
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });

    // 3️⃣ Validate subCategory belongs to category
    if (subCategory) {
      const subCat = await SubCategory.findById(subCategory);
      if (!subCat || subCat.category.toString() !== category)
        return res
          .status(400)
          .json({ success: false, message: "Invalid subCategory" });
    }

    // 4️⃣ Separate product images and variant images
    const productImages = [];
    const variantImagesMap = {};

    console.log("Uploaded files:", req.files);

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.originalname.startsWith("product-")) {
          // Example: product-0-main.png
          productImages.push(`/uploads/${file.filename}`);
        } else if (file.originalname.startsWith("variant-")) {
          // Example: variant-1-0-red.png
          const parts = file.originalname.split("-");
          const variantIndex = Number(parts[1]); // variant-1-...

          if (!variantImagesMap[variantIndex]) {
            variantImagesMap[variantIndex] = [];
          }

          variantImagesMap[variantIndex].push(`/uploads/${file.filename}`);
        }
      });
    }

    const normalizedVariants = (variants || []).map((v, i) => ({
      color: v.color || "",
      size: v.size || "",
      price: Number(v.price) || 0,
      discountPrice: Number(v.discountPrice) || 0,
      SKU: v.SKU || nanoid(8),
      stock: Number(v.stock) || 0,
      images: variantImagesMap[i] || [],
    }));

    // 6️⃣ Calculate global stock
    const globalStock =
      normalizedVariants.length > 0
        ? normalizedVariants.reduce((sum, v) => sum + v.stock, 0)
        : stock || 0;

    // Slug uniqueness
    const slug = await generateUniqueSlug(name);

    // 7️⃣ Create product instance
    const product = new Product({
      name,
      description,
      price: Number(price) || 0,
      category,
      subCategory,
      variants: normalizedVariants,
      stock: globalStock,
      images: productImages,
      brand,
      slug: slug,
      createdBy: req.user._id,
      status: "active",
      tags: tags || [],
    });

    // 8️⃣ Save product
    const savedProduct = await product.save();

    // 9️⃣ Log action
    await logAction({
      userId: req.user._id,
      action: "CREATE_PRODUCT",
      entity: "Product",
      entityId: savedProduct._id,
      description: `Created product ${savedProduct.name}`,
      ipAddress: req.ip,
    });

    // 10️⃣ Return success
    res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/** -------> Get All Products -------> */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("createdBy", "name email");
    res.status(200).json({
      success: true,
      message: "Products fetched successfully!",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/** -------> Get Product by ID -------> */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("createdBy", "name email");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/** -------> Update Product -------> */
export const updateProduct = async (req, res) => {
  try {
    // 1️⃣ Find product with populated category/subCategory
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 2️⃣ Parse incoming data
    let bodyData = {};
    if (req.body.data && typeof req.body.data === "string") {
      bodyData = JSON.parse(req.body.data); // FormData case
    } else {
      bodyData = req.body; // JSON case
    }

    console.log("✅ Product controller hit with bodyData:", bodyData);

    const {
      name,
      description,
      price,
      category,
      subCategory,
      variants,
      stock,
      images: bodyImages,
      brand,
      status,
      tags,
    } = bodyData;

    const categoryId =
      category && typeof category === "object" ? category._id : category;
    const subCategoryId =
      subCategory && typeof subCategory === "object"
        ? subCategory._id
        : subCategory;

    // 3️⃣ Category validation
    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (!cat) {
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      }
      product.category = categoryId;
    }

    // 4️⃣ Subcategory validation
    if (subCategoryId) {
      const subCat = await SubCategory.findById(subCategoryId);
      if (
        !subCat ||
        subCat.category.toString() !==
          (categoryId || product.category.toString())
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid subCategory" });
      }
      product.subCategory = subCategoryId;
    }

    // 5️⃣ Merge images (old + new, remove duplicates)
    const mergeImages = (bodyImages = [], files = []) => {
      const filePaths = files.map((f) => `/uploads/${f.filename}`);
      const merged = [...bodyImages.filter(Boolean), ...filePaths];
      return Array.from(new Set(merged)); // ensure no duplicates
    };
    const merged = mergeImages(bodyImages, req.files);
    if (merged.length > 0) {
      product.images = merged;
    }

    // 6️⃣ Update fields
    product.name = name || product.name;
    product.slug = name ? slugify(name.toLowerCase()) : product.slug;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.variants = variants || product.variants;

    // If no global stock provided, compute from variants
    if (stock !== undefined) {
      product.stock = stock;
    } else if (variants && variants.length > 0) {
      product.stock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    }

    product.brand = brand || product.brand;
    if (status) product.status = status;

    // 7️⃣ Tags (optimized: use populated names if available, no extra DB calls unless needed)
    if (tags && tags.length > 0) {
      product.tags = [...new Set(tags.map((t) => t.toLowerCase().trim()))];
    } else {
      const categoryName =
        product.category?.name ||
        (categoryId && (await Category.findById(categoryId))?.name);
      const subCategoryName =
        product.subCategory?.name ||
        (subCategoryId && (await SubCategory.findById(subCategoryId))?.name);

      product.tags = generateTags({
        name: product.name,
        brand: product.brand,
        categoryName,
        subCategoryName,
      });
    }

    // 8️⃣ Save & log
    await product.save();

    await logAction({
      userId: req.user._id,
      action: "UPDATE_PRODUCT",
      entity: "Product",
      entityId: product._id,
      description: `Updated product ${product.name}`,
      ipAddress: req.ip,
    });

    res
      .status(200)
      .json({ success: true, message: "Product updated", data: product });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/** -------> Delete Product -------> */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    console.log("Product->", product);

    // Delete all images
    await Promise.all(
      product.images.map(async (imgPath) => {
        const filePath = path.join("uploads", path.basename(imgPath));
        try {
          await fs.promises.unlink(filePath);
        } catch (err) {
          console.error("Failed to delete image:", filePath, err);
        }
      })
    );

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    await logAction({
      userId: req.user._id,
      action: "DELETE_PRODUCT",
      entity: "Product",
      entityId: deletedProduct._id,
      description: `Deleted product ${deletedProduct.name}`,
      ipAddress: req.ip,
    });

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
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
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
};
