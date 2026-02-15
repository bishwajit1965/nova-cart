import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  SKU: { type: String, unique: true, sparse: true },
  stock: { type: Number, default: 0 },
  // ⭐ NEW: Variant-level image gallery support
  images: [String],
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number }, // base price (if no variants)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    variants: [variantSchema],
    stock: { type: Number, default: 1 }, // fallback stock if no variants
    images: [String], // product-level images
    brand: { type: String },
    // ✅ SEO & Search
    slug: { type: String, unique: true, index: true },
    tags: [String],
    // ✅ Extra
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true },
);

productSchema.methods.getVariant = function (variantId) {
  return this.variants.id(variantId);
};

productSchema.virtual("totalStock").get(function () {
  if (this.variants && this.variants.length > 0) {
    return this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  return this.stock;
});

// SKU (Stock Keeping Unit) = a unique code merchants use to track inventory.
productSchema.pre("save", function (next) {
  if (this.variants && this.variants.length > 0) {
    this.variants.forEach((variant, index) => {
      if (!variant.SKU || variant.SKU.trim() === "") {
        const prefix = this.name
          .replace(/\s+/g, "")
          .substring(0, 5)
          .toUpperCase();

        variant.SKU = `${prefix}-${index + 1}-${Date.now()
          .toString()
          .slice(-4)}`;
      }
    });
  }
  next();
});

export default mongoose.model("Product", productSchema);
