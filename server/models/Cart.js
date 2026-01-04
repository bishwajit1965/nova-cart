import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId, // just store the ObjectId, no ref to sub document
    },
    name: { type: String, required: true },
    brand: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true }, // snapshot price
    discountPrice: { type: Number, default: 0 }, // snapshot discount
    subtotal: { type: Number, required: true }, // quantity * (price - discount)
    image: { type: String },
    quantity: { type: Number, default: 1, min: 1 },
    SKU: { type: String },
  },
  { _id: true } // give each cart item an _id for easier updates
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);

// import mongoose from "mongoose";

// const cartItemSchema = new mongoose.Schema(
//   {
//     product: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//     },
//     variantId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product.variants", // reference to sub-document if you want
//     },
//     name: { type: String },
//     brand: { type: String },
//     color: { type: String },
//     size: { type: String },
//     price: { type: Number },
//     image: { type: String },
//     quantity: { type: Number, default: 1, min: 1 },
//   },
//   { _id: false }
// );

// const cartSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     items: [cartItemSchema], // array of products + quantities
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Cart", cartSchema);
